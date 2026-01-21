import { randomUUID } from 'crypto';
import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  ManyToOne,
} from 'typeorm';
import { Product } from './product.entity';
import { AttributeDefinition } from './attribute-definition.entity';

@Entity()
export class ProductAttributeValue {
  @PrimaryColumn('uuid')
  id: string;

  @BeforeInsert()
  generateId() {
    if (!this.id) this.id = randomUUID();
  }

  @ManyToOne(() => Product, (product) => product.attributeValues, {
    nullable: false,
  })
  product: Product;

  @Column({ type: 'uuid' })
  productId: string;

  @ManyToOne(() => AttributeDefinition, (attribute) => attribute.values, {
    nullable: false,
  })
  attribute: AttributeDefinition;

  @Column({ type: 'uuid' })
  attributeId: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  valueText?: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  valueNumber?: number;

  @Column({ type: 'boolean', nullable: true })
  valueBoolean?: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
