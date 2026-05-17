import { randomUUID } from 'crypto';
import { Order } from '../../orders/entities/order.entity';
import {
    Entity,
    PrimaryColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    BeforeInsert,
    OneToMany,
} from 'typeorm';

@Entity()
export class User {
    @PrimaryColumn('uuid')
    id: string;

    @BeforeInsert()
    generateId() {
        if (!this.id) this.id = randomUUID();
    }

    @Column({ type: 'varchar', nullable: true })
    firstname?: string | null;

    @Column({ type: 'varchar', nullable: true })
    lastname?: string | null;

    @Column({ unique: true })
    email: string;

    @Column({ unique: true })
    cognitoSub: string;

    @Column({ default: false })
    isEmailVerified: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Order, (order) => order.user)
    orders: Order[];
}
