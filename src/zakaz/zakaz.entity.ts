import { ProductEntity } from "src/products/products.entity";
import { UserEntity } from "src/user/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ZakazEntity{
    @PrimaryGeneratedColumn()
    id : number

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    date: Date;
  
    @ManyToOne(() => UserEntity, (user) => user.zakazy)
    user: UserEntity;
  
    @Column('simple-array')
    productList: number[];
}