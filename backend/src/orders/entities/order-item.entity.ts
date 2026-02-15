import { randomUUID } from 'crypto';
import {
  Entity,
  PrimaryColumn,
  Column,
  BeforeInsert,
  ManyToOne,
  Index,
} from 'typeorm';
import { Order } from './order.entity';
import { Product } from 'src/catalog/products/entities/product.entity';

@Entity()
export class OrderItem {
  @PrimaryColumn('uuid')
  id: string;

  @BeforeInsert()
  generateId() {
    if (!this.id) this.id = randomUUID();
  }

  @ManyToOne(() => Order, (order) => order.items, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  order: Order;

  @Index()
  @Column({ type: 'uuid' })
  orderId: string;

  @ManyToOne(() => Product, { nullable: false, onDelete: 'RESTRICT' })
  product: Product;

  @Index()
  @Column({ type: 'uuid' })
  productId: string;

  @Column({ type: 'varchar', length: 150 })
  productName: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  lineTotal: number;

  @Column({ type: 'jsonb', default: () => "'[]'" })
  selectedOptions: Array<{
    optionGroupId: string;
    optionGroupName: string;
    optionValueId: string;
    optionValueLabel: string;
    priceAdjustment: number;
  }>;
}
