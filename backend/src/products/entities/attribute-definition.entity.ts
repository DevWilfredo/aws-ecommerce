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
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { ProductAttributeValue } from './product-attribute-value.entity';

export enum AttributeDataType {
  Text = 'text',
  Number = 'number',
  Boolean = 'boolean',
}

@Entity()
export class AttributeDefinition {
  @PrimaryColumn('uuid')
  id: string;

  @BeforeInsert()
  generateId() {
    if (!this.id) this.id = randomUUID();
  }

  @Column({ type: 'varchar', length: 120 })
  name: string;

  @Column({ type: 'varchar', length: 40, nullable: true })
  unit?: string;

  @Column({
    type: 'enum',
    enum: AttributeDataType,
    default: AttributeDataType.Text,
  })
  dataType: AttributeDataType;

  @ManyToOne(() => Category, (category) => category.attributeDefinitions, {
    nullable: false,
  })
  category: Category;

  @Column({ type: 'uuid' })
  categoryId: string;

  @OneToMany(() => ProductAttributeValue, (value) => value.attribute)
  values: ProductAttributeValue[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
