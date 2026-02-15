import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Stripe from 'stripe';
import { DataSource, In, Repository } from 'typeorm';

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
      const productIds = dto.items.map((i) => i.productId);

      const products = await manager.getRepository(Product).find({
        where: { id: In(productIds) },
        relations: ['optionGroups', 'optionGroups.optionValues'],
      });

      if (products.length !== productIds.length) {
        throw new BadRequestException('One or more products do not exist');
      }

      const items: OrderItem[] = [];
      let subtotal = 0;

      for (const i of dto.items) {
        const p = products.find((x) => x.id === i.productId);
        if (!p) throw new BadRequestException('Invalid product in cart');

        if (i.quantity > p.stock) {
          throw new BadRequestException(`Insufficient stock for product ${p.name}`);
        }

        const selectedOptions = (i.selectedOptions ?? []).map((item) => ({
          optionGroupId: item.optionGroupId,
          optionValueId: item.optionValueId,
        }));

        const normalizedOptions = p.optionGroups
          .map((group) => {
            const selected =
              selectedOptions.find((option) => option.optionGroupId === group.id)?.optionValueId ??
              group.optionValues?.[0]?.id;

            if (!selected) return null;

            const value = group.optionValues.find((optionValue) => optionValue.id === selected);
            if (!value) {
              throw new BadRequestException(
                `Invalid option selected for group ${group.name} in product ${p.name}`,
              );
            }

            return {
              optionGroupId: group.id,
              optionGroupName: group.name,
              optionValueId: value.id,
              optionValueLabel: value.label,
              priceAdjustment: Number(value.priceAdjustment ?? 0),
            };
          })
          .filter((option) => option !== null);

        const optionsPrice = normalizedOptions.reduce(
          (sum, option) => sum + Number(option?.priceAdjustment ?? 0),
          0,
        );

        const unitPrice = Number((Number(p.price) + optionsPrice).toFixed(2));
        const lineTotal = Number((unitPrice * i.quantity).toFixed(2));
        subtotal = Number((subtotal + lineTotal).toFixed(2));

        items.push(
          manager.getRepository(OrderItem).create({
            productId: p.id,
            productName: p.name,
            unitPrice,
            quantity: i.quantity,
            lineTotal,
            selectedOptions: normalizedOptions,
          }),
        );
      }

      const shippingCost = 0;
      const tax = 0;
      const discount = 0;
      const total = Number((subtotal + shippingCost + tax - discount).toFixed(2));

      const order = manager.getRepository(Order).create({
        userId,
        status: OrderStatus.PENDING,
        currency: dto.currency ?? 'EUR',
        subtotal,
        shippingCost,
        tax,
        discount,
        total,
        shippingFullName: dto.shipping.fullName,
        shippingPhone: dto.shipping.phone,
        shippingAddressLine1: dto.shipping.addressLine1,
        shippingAddressLine2: dto.shipping.addressLine2 ?? null,
        shippingCity: dto.shipping.city,
        shippingState: dto.shipping.state,
        shippingPostalCode: dto.shipping.postalCode,
        shippingCountryCode: dto.shipping.countryCode,
        items,
      });

      const savedOrder = await manager.getRepository(Order).save(order);

      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        success_url: `${frontendUrl}/checkout/success?orderId=${savedOrder.id}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${frontendUrl}/checkout/cancel?orderId=${savedOrder.id}`,
        client_reference_id: savedOrder.id,
        metadata: {
          orderId: savedOrder.id,
          userId,
        },
        line_items: items.map((item) => ({
          quantity: item.quantity,
          price_data: {
            currency: (dto.currency ?? 'EUR').toLowerCase(),
            unit_amount: Math.round(Number(item.unitPrice) * 100),
            product_data: {
              name: item.productName,
              description: item.selectedOptions?.length
                ? item.selectedOptions
                    .map((option) => `${option.optionGroupName}: ${option.optionValueLabel}`)
                    .join(' · ')
                : undefined,
            },
          },
        })),
      });

      savedOrder.stripeCheckoutSessionId = session.id;
      await manager.getRepository(Order).save(savedOrder);

      return { orderId: savedOrder.id, checkoutUrl: session.url };
    });
  }

  async handleStripeWebhook(rawBody: Buffer, signature: string) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    if (!webhookSecret) throw new Error('Missing STRIPE_WEBHOOK_SECRET');

    const event = this.stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      const orderId =
        (session.metadata?.orderId as string | undefined) ||
        (session.client_reference_id as string | undefined);

      if (!orderId) return;

      const order = await this.orderRepo.findOne({ where: { id: orderId } });
      if (!order) return;

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

    if (event.type === 'checkout.session.expired') {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId =
        (session.metadata?.orderId as string | undefined) ||
        (session.client_reference_id as string | undefined);

      if (!orderId) return;

      const order = await this.orderRepo.findOne({ where: { id: orderId } });
      if (!order) return;

      if (order.status === OrderStatus.PENDING) {
        order.status = OrderStatus.CANCELED;
        await this.orderRepo.save(order);
      }
    }
  }
}
