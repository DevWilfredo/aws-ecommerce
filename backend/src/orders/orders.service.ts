import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dtos/create-order.dto';
import { Product } from 'src/catalog/products/entities/product.entity';
import { OrderStatus } from './entities/order-status.enum';
import { UpdateOrderStatusDto } from './dtos/update-order-status.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectRepository(Product) private readonly productRepo: Repository<Product>,
  ) {}

  async create(userId: string, dto: CreateOrderDto) {
    if (!dto.items?.length) throw new BadRequestException('Order must have at least one item');

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

      for (const reqItem of dto.items) {
        const product = products.find((p) => p.id === reqItem.productId);
        if (!product) throw new BadRequestException('Invalid product in order');

        if (reqItem.quantity > product.stock) {
          throw new BadRequestException(`Insufficient stock for product ${product.name}`);
        }

        const selectedOptions = (reqItem.selectedOptions ?? []).map((item) => ({
          optionGroupId: item.optionGroupId,
          optionValueId: item.optionValueId,
        }));

        const normalizedOptions = product.optionGroups
          .map((group) => {
            const selected =
              selectedOptions.find((option) => option.optionGroupId === group.id)?.optionValueId ??
              group.optionValues?.[0]?.id;

            if (!selected) return null;

            const value = group.optionValues.find((optionValue) => optionValue.id === selected);
            if (!value) {
              throw new BadRequestException(
                `Invalid option selected for group ${group.name} in product ${product.name}`,
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

        const unitPrice = Number((Number(product.price) + optionsPrice).toFixed(2));
        const lineTotal = Number((unitPrice * reqItem.quantity).toFixed(2));
        subtotal = Number((subtotal + lineTotal).toFixed(2));

        const item = manager.getRepository(OrderItem).create({
          productId: product.id,
          productName: product.name,
          unitPrice,
          quantity: reqItem.quantity,
          lineTotal,
          selectedOptions: normalizedOptions,
        });

        items.push(item);
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

      const saved = await manager.getRepository(Order).save(order);

      for (const reqItem of dto.items) {
        await manager.getRepository(Product).decrement({ id: reqItem.productId }, 'stock', reqItem.quantity);
      }

      return manager.getRepository(Order).findOne({
        where: { id: saved.id },
        relations: { items: true },
      });
    });
  }

  async findMine(userId: string) {
    return this.orderRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      relations: { items: true },
    });
  }

  async findOneMine(userId: string, orderId: string) {
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
      relations: { items: true },
    });
    if (!order) throw new NotFoundException('Order not found');
    if (order.userId !== userId) throw new ForbiddenException();
    return order;
  }

  async updateStatus(orderId: string, dto: UpdateOrderStatusDto) {
    const order = await this.orderRepo.findOne({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');

    order.status = dto.status;
    await this.orderRepo.save(order);
    return order;
  }

  async cancelMine(userId: string, orderId: string) {
    const order = await this.findOneMine(userId, orderId);

    if ([OrderStatus.SHIPPED, OrderStatus.DELIVERED].includes(order.status)) {
      throw new BadRequestException('Cannot cancel an order that has been shipped/delivered');
    }

    return this.dataSource.transaction(async (manager) => {
      const full = await manager.getRepository(Order).findOne({
        where: { id: orderId },
        relations: { items: true },
      });
      if (!full) throw new NotFoundException('Order not found');
      if (full.userId !== userId) throw new ForbiddenException();

      full.status = OrderStatus.CANCELED;
      await manager.getRepository(Order).save(full);

      for (const item of full.items) {
        await manager.getRepository(Product).increment({ id: item.productId }, 'stock', item.quantity);
      }

      return full;
    });
  }
}
