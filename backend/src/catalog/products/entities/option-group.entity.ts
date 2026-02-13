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
  ManyToMany,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { OptionValue } from './option-value.entity';
import { Product } from './product.entity';

@Entity()
export class OptionGroup {
  @PrimaryColumn('uuid')
  id: string;

  @BeforeInsert()
  generateId() {
    if (!this.id) this.id = randomUUID();
  }

  @Column({ type: 'varchar', length: 120 })
  name: string;

  @Column({ type: 'varchar', length: 160, nullable: true })
  description?: string;

  @ManyToOne(() => Category, (category) => category.optionGroups, {
    nullable: false,
  })
  category: Category;

  @Column({ type: 'uuid' })
  categoryId: string;

  @OneToMany(() => OptionValue, (optionValue) => optionValue.optionGroup)
  optionValues: OptionValue[];

  @ManyToMany(() => Product, (product) => product.optionGroups)
  products: Product[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
