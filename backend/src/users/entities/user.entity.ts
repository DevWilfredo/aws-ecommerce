import { randomUUID } from 'crypto';
import {
    Entity,
    PrimaryColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    BeforeInsert,
} from 'typeorm';

@Entity()
export class User {
    @PrimaryColumn('uuid')
    id: string;

    @BeforeInsert()
    generateId() {
        if (!this.id) this.id = randomUUID();
    }

    @Column()
    firstname: string;

    @Column()
    lastname: string;

    @Column({ unique: true })
    email: string;

    @Column({ select: false })
    password: string;

    @Column({ default: false })
    isEmailVerified: boolean;

    @Column({ type: 'varchar', nullable: true })
    verificationToken?: string | null;

    @Column({ nullable: true, type: 'timestamp' })
    verificationTokenExpiresAt?: Date | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
