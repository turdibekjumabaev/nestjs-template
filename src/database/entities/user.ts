import { CustomBaseEntity } from "src/common/entities";
import { Column, Entity } from "typeorm"

@Entity({ name: 'users' })
export class User extends CustomBaseEntity {

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

    @Column({ type: 'bigint', nullable: true })
    public telegram_id?: number;

    // @Expose()
    get avatar_url(): string | null {
        return this.avatar ? `${process.env.APP_URL}/${this.avatar}` : null;
    }
}
