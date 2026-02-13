import { randomUUID } from 'crypto';
import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { AttributeDefinition } from '../../products/entities/attribute-definition.entity';
import { OptionGroup } from '../../products/entities/option-group.entity';

@Entity()
export class Category {
  @PrimaryColumn('uuid')
  id: string;

  @BeforeInsert()
  generateId() {
    if (!this.id) this.id = randomUUID();
  }

  @Column({ type: 'varchar', length: 120, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 160, unique: true })
  slug: string;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  @OneToMany(() => AttributeDefinition, (attribute) => attribute.category)
  attributeDefinitions: AttributeDefinition[];

  @OneToMany(() => OptionGroup, (optionGroup) => optionGroup.category)
  optionGroups: OptionGroup[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
