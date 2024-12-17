// import { ProductEntity } from "src/products/products.entity";
import { ApiProperty } from "@nestjs/swagger";
import { UserEntity } from "../user/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ZakazEntity{
    @PrimaryGeneratedColumn()
    id : number

    @ApiProperty({example : "2026-12-17 09:35:20.811", description : "Дата покупки"})
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    date: Date;

    @ApiProperty({type : ()=>UserEntity, description : "Пользователь"})
    @ManyToOne(() => UserEntity, (user) => user.zakazy)
    user: UserEntity;

    @ApiProperty({example : [1,5,3], description : "АйДи купленных товаров"})
    @Column('simple-array')
    productList: number[];
}