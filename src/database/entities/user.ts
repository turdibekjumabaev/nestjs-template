import { Exclude, Expose } from "class-transformer";
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

@Entity({ name: 'users' })
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ nullable: true })
    public first_name?: string;

    @Column({ nullable: true })
    public sur_name?: string;

    @Column({ nullable: true })
    public middle_name?: string;

    @Column({ nullable: false, unique: true })
    public phone: string;

    @Column({ type: 'datetime' })
    public phone_verified_at?: Date;

    @Column({ type: 'date', nullable: true })
    public date_of_birth?: Date;

    @Column({ nullable: true })
    public avatar?: string;

    @Column({ nullable: true, unique: true })
    public email?: string;

    @Column({ type: 'boolean', default: true, select: false })
    public is_active: boolean | true;

    @CreateDateColumn({ select: false })
    public created_at: Date;

    @UpdateDateColumn({ select: false })
    public updated_at?: Date;

    @DeleteDateColumn({ select: false })
    public deleted_at?: Date;

    // @Expose()
    get avatar_url(): string | null {
        return this.avatar ? `${process.env.APP_URL}/${this.avatar}` : null;
    }
}
