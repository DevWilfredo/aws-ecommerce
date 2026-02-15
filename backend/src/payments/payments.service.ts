import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Stripe from 'stripe';
import { DataSource, In, Repository } from 'typeorm';

import { Product } from 'src/catalog/products/entities/product.entity';
import { Order } from 'src/orders/entities/order.entity';
import { OrderItem } from 'src/orders/entities/order-item.entity';
import { CreateCheckoutSessionDto } from './dtos/create-checkout-session.dto';
import { ConfirmCheckoutSessionDto } from './dtos/confirm-checkout-session.dto';
import { OrderStatus } from 'src/orders/entities/order-status.enum';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  public readonly stripe: Stripe;

  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2026-01-28.clover',
    });
  }

  private resolveProductImage(product?: Product): string | undefined {
    if (!product?.images?.length) return undefined;

    const featured = product.images.find((image) => image.isFeatured)?.imageUrl;
    if (featured?.startsWith('https://')) return featured;

    return [...product.images]
      .sort((a, b) => a.position - b.position)
      .find((image) => image.imageUrl?.startsWith('https://'))?.imageUrl;
  }

  private getOrderIdFromSession(session: Stripe.Checkout.Session): string | undefined {
    return (
      (session.metadata?.orderId as string | undefined) ||
      (session.client_reference_id as string | undefined)
    );
  }

  private async markOrderAsPaid(
    orderId: string,
    params: { sessionId?: string; paymentIntentId?: string },
  ) {
    const order = await this.orderRepo.findOne({ where: { id: orderId } });
    if (!order) {
      this.logger.warn(`Order not found while marking as paid: ${orderId}`);
      return;
    }

    if (order.status !== OrderStatus.PAID) {
      order.status = OrderStatus.PAID;
      order.paidAt = order.paidAt ?? new Date();
    }

    if (params.sessionId) {
      order.stripeCheckoutSessionId = params.sessionId;
    }

    if (params.paymentIntentId) {
      order.stripePaymentIntentId = params.paymentIntentId;
    }

    await this.orderRepo.save(order);
  }

  private async markOrderAsCanceled(orderId: string) {
    const order = await this.orderRepo.findOne({ where: { id: orderId } });
    if (!order) {
      this.logger.warn(`Order not found while marking as canceled: ${orderId}`);
      return;
    }

    if (order.status === OrderStatus.PENDING) {
      order.status = OrderStatus.CANCELED;
      await this.orderRepo.save(order);
    }
  }

  async createCheckoutSession(userId: string, dto: CreateCheckoutSessionDto) {
    if (!dto.items?.length) throw new BadRequestException('Cart is empty');
    const frontendUrl = process.env.FRONTEND_URL!;
    const stripe = this.stripe;

    return this.dataSource.transaction(async (manager) => {
      const productIds = dto.items.map((i) => i.productId);

      const products = await manager.getRepository(Product).find({
        where: { id: In(productIds) },
        relations: ['optionGroups', 'optionGroups.optionValues', 'images'],
      });

      if (products.length !== productIds.length) {
        throw new BadRequestException('One or more products do not exist');
      }

      const productById = new Map(products.map((product) => [product.id, product]));
      const items: OrderItem[] = [];
      let subtotal = 0;

      for (const i of dto.items) {
        const p = productById.get(i.productId);
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
              selectedOptions.find((option) => option.optionGroupId === group.id)
                ?.optionValueId ?? group.optionValues?.[0]?.id;

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

      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item) => {
        const product = productById.get(item.productId);
        const imageUrl = this.resolveProductImage(product);

        return {
          quantity: item.quantity,
          price_data: {
            currency: (dto.currency ?? 'EUR').toLowerCase(),
            unit_amount: Math.round(Number(item.unitPrice) * 100),
            product_data: {
              name: item.productName,
              description: item.selectedOptions?.length
                ? item.selectedOptions
                    .map((option) => `${option.optionGroupName}: ${option.optionValueLabel}`)
                    .join(' | ')
                : undefined,
              images: imageUrl ? [imageUrl] : undefined,
            },
          },
        };
      });

      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        success_url: `${frontendUrl}/checkout/success?orderId=${savedOrder.id}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${frontendUrl}/checkout/cancel?orderId=${savedOrder.id}`,
        client_reference_id: savedOrder.id,
        metadata: {
          orderId: savedOrder.id,
          userId,
        },
        payment_intent_data: {
          metadata: {
            orderId: savedOrder.id,
            userId,
          },
        },
        line_items: lineItems,
      });

      savedOrder.stripeCheckoutSessionId = session.id;
      await manager.getRepository(Order).save(savedOrder);

      return { orderId: savedOrder.id, checkoutUrl: session.url };
    });
  }

  async confirmCheckoutSession(userId: string, dto: ConfirmCheckoutSessionDto) {
    const order = await this.orderRepo.findOne({
      where: { id: dto.orderId, userId },
    });

    if (!order) {
      throw new BadRequestException('Order not found for this user');
    }

    const session = await this.stripe.checkout.sessions.retrieve(dto.sessionId, {
      expand: ['payment_intent'],
    });

    const sessionOrderId = this.getOrderIdFromSession(session);
    if (sessionOrderId && sessionOrderId !== dto.orderId) {
      throw new BadRequestException('Session does not belong to this order');
    }

    if (session.payment_status !== 'paid') {
      throw new BadRequestException('Stripe session is not paid yet');
    }

    const paymentIntentId =
      typeof session.payment_intent === 'string'
        ? session.payment_intent
        : (session.payment_intent?.id ?? undefined);

    await this.markOrderAsPaid(dto.orderId, {
      sessionId: session.id,
      paymentIntentId,
    });

    return {
      orderId: dto.orderId,
      status: OrderStatus.PAID,
    };
  }

  async handleStripeWebhook(rawBody: Buffer, signature: string) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    if (!webhookSecret) throw new Error('Missing STRIPE_WEBHOOK_SECRET');

    const event = this.stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);

    switch (event.type) {
      case 'checkout.session.completed':
      case 'checkout.session.async_payment_succeeded': {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = this.getOrderIdFromSession(session);
        if (!orderId) {
          this.logger.warn(`Missing orderId in Stripe session ${session.id}`);
          return;
        }

        const paymentIntentId =
          typeof session.payment_intent === 'string'
            ? session.payment_intent
            : (session.payment_intent?.id ?? undefined);

        await this.markOrderAsPaid(orderId, {
          sessionId: session.id,
          paymentIntentId,
        });
        return;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderId = paymentIntent.metadata?.orderId;
        if (!orderId) {
          this.logger.warn(`Missing orderId in payment_intent ${paymentIntent.id}`);
          return;
        }

        await this.markOrderAsPaid(orderId, {
          paymentIntentId: paymentIntent.id,
        });
        return;
      }

      case 'checkout.session.expired':
      case 'checkout.session.async_payment_failed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = this.getOrderIdFromSession(session);
        if (!orderId) {
          this.logger.warn(`Missing orderId for cancel/expire event in session ${session.id}`);
          return;
        }

        await this.markOrderAsCanceled(orderId);
        return;
      }

      default:
        return;
    }
  }
}
