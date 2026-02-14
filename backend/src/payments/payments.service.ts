import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Stripe from 'stripe';
import { DataSource, Repository } from 'typeorm';

import { Product } from 'src/catalog/products/entities/product.entity';
import { Order } from 'src/orders/entities/order.entity';
import { OrderItem } from 'src/orders/entities/order-item.entity';

import { CreateCheckoutSessionDto } from './dtos/create-checkout-session.dto';
import { OrderStatus } from 'src/orders/entities/order-status.enum';

@Injectable()
export class PaymentsService {
    public readonly stripe: Stripe;

    constructor(
        private readonly dataSource: DataSource,
        @InjectRepository(Order)
        private readonly orderRepo: Repository<Order>,
        @InjectRepository(Product)
        private readonly productRepo: Repository<Product>,
    ) {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
            apiVersion: '2026-01-28.clover',
        });
    }

    async createCheckoutSession(userId: string, dto: CreateCheckoutSessionDto) {
        if (!dto.items?.length) throw new BadRequestException('Cart is empty');
        const frontendUrl = process.env.FRONTEND_URL!;
        const stripe = this.stripe;

        return this.dataSource.transaction(async (manager) => {
            // 1) cargar productos
            const productIds = dto.items.map((i) => i.productId);

            // Nota: findBy con "id: productIds as any" funciona, pero esta forma es más limpia:
            const products = await manager.getRepository(Product).findByIds(productIds);

            if (products.length !== productIds.length) {
                throw new BadRequestException('One or more products do not exist');
            }

            // 2) crear items snapshot + subtotal
            const items: OrderItem[] = [];
            let subtotal = 0;

            for (const i of dto.items) {
                const p = products.find((x) => x.id === i.productId)!;

                if (i.quantity > p.stock) {
                    throw new BadRequestException(
                        `Insufficient stock for product ${p.name}`,
                    );
                }

                const unitPrice = Number(p.price);
                const lineTotal = Number((unitPrice * i.quantity).toFixed(2));
                subtotal = Number((subtotal + lineTotal).toFixed(2));

                items.push(
                    manager.getRepository(OrderItem).create({
                        productId: p.id,
                        productName: p.name,
                        unitPrice,
                        quantity: i.quantity,
                        lineTotal,
                    }),
                );
            }

            // 3) totales (MVP)
            const shippingCost = 0;
            const tax = 0;
            const discount = 0;
            const total = Number((subtotal + shippingCost + tax - discount).toFixed(2));

            // 4) crear order PENDING
            const order = manager.getRepository(Order).create({
                userId,
                status: OrderStatus.PENDING,
                currency: 'EUR',
                subtotal,
                shippingCost,
                tax,
                discount,
                total,

                // MVP: placeholder de shipping (luego lo cambiamos)
                shippingFullName: 'Pending',
                shippingPhone: 'Pending',
                shippingAddressLine1: 'Pending',
                shippingAddressLine2: null,
                shippingCity: 'Pending',
                shippingState: 'Pending',
                shippingPostalCode: 'Pending',
                shippingCountryCode: 'ES',

                items,
            });

            const savedOrder = await manager.getRepository(Order).save(order);

            // 5) crear checkout session
            const session = await stripe.checkout.sessions.create({
                mode: 'payment',
                success_url: `${frontendUrl}/checkout/success?orderId=${savedOrder.id}&session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${frontendUrl}/checkout/cancel?orderId=${savedOrder.id}`,
                client_reference_id: savedOrder.id,
                metadata: {
                    orderId: savedOrder.id,
                    userId,
                },
                line_items: dto.items.map((i) => {
                    const p = products.find((x) => x.id === i.productId)!;
                    return {
                        quantity: i.quantity,
                        price_data: {
                            currency: 'eur',
                            unit_amount: Math.round(Number(p.price) * 100), // cents
                            product_data: {
                                name: p.name,
                            },
                        },
                    };
                }),
            });

            // 6) guardar sessionId en la order
            savedOrder.stripeCheckoutSessionId = session.id;
            await manager.getRepository(Order).save(savedOrder);

            return { orderId: savedOrder.id, checkoutUrl: session.url };
        });
    }

    async handleStripeWebhook(rawBody: Buffer, signature: string) {
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
        if (!webhookSecret) throw new Error('Missing STRIPE_WEBHOOK_SECRET');

        const event = this.stripe.webhooks.constructEvent(
            rawBody,
            signature,
            webhookSecret,
        );

        // ✅ Evento recomendado para Checkout
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as Stripe.Checkout.Session;

            const orderId =
                (session.metadata?.orderId as string | undefined) ||
                (session.client_reference_id as string | undefined);

            if (!orderId) return;

            const order = await this.orderRepo.findOne({ where: { id: orderId } });
            if (!order) return;

            // idempotencia básica: si ya está pagada, no hagas nada
            if (order.status === OrderStatus.PAID) return;

            order.status = OrderStatus.PAID;
            order.paidAt = new Date();
            order.stripeCheckoutSessionId = session.id;
            order.stripePaymentIntentId =
                typeof session.payment_intent === 'string'
                    ? session.payment_intent
                    : (session.payment_intent?.id ?? null);

            await this.orderRepo.save(order);
        }

        // (Opcional) Si quieres manejar fallos
        if (event.type === 'checkout.session.expired') {
            const session = event.data.object as Stripe.Checkout.Session;
            const orderId =
                (session.metadata?.orderId as string | undefined) ||
                (session.client_reference_id as string | undefined);

            if (!orderId) return;

            const order = await this.orderRepo.findOne({ where: { id: orderId } });
            if (!order) return;

            if (order.status === OrderStatus.PENDING) {
                order.status = OrderStatus.CANCELED; // o deja PENDING, como prefieras
                await this.orderRepo.save(order);
            }
        }
    }
}
