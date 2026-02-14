import { randomUUID } from 'crypto';
import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  ManyToOne,
  OneToMany,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { OrderItem } from './order-item.entity';
import { OrderStatus } from './order-status.enum';


@Entity()
export class Order {
  @PrimaryColumn('uuid')
  id: string;

  @BeforeInsert()
  generateId() {
    if (!this.id) this.id = randomUUID();
  }

  @ManyToOne(() => User, { nullable: false, onDelete: 'RESTRICT' })
  user: User;

  @Index()
  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  // Totales (guardar snapshots de cálculo)
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  shippingCost: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  tax: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total: number;

  @Column({ type: 'varchar', length: 3, default: 'EUR' })
  currency: string;

  @Column({ type: 'varchar', length: 120 })
  shippingFullName: string;

  @Column({ type: 'varchar', length: 30 })
  shippingPhone: string;

  @Column({ type: 'varchar', length: 200 })
  shippingAddressLine1: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  shippingAddressLine2?: string | null;

  @Column({ type: 'varchar', length: 80 })
  shippingCity: string;

  @Column({ type: 'varchar', length: 80 })
  shippingState: string;

  @Column({ type: 'varchar', length: 20 })
  shippingPostalCode: string;

  @Column({ type: 'varchar', length: 2 })
  shippingCountryCode: string;

  @OneToMany(() => OrderItem, (item) => item.order, {
    cascade: ['insert', 'update'],
  })
  items: OrderItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'varchar', nullable: true })
  stripeCheckoutSessionId?: string | null;

  @Column({ type: 'varchar', nullable: true })
  stripePaymentIntentId?: string | null;

  @Column({ type: 'varchar', nullable: true })
  stripeCustomerId?: string | null;

  @Column({ type: 'timestamp', nullable: true })
  paidAt?: Date | null;
}
