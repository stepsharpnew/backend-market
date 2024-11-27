import { CategoryEntity } from "src/entitys/category.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name : 'products'})

export class ProductEntity {
    @PrimaryGeneratedColumn()
    id : number

    @Column()
    name : string

    @Column()
    price : number

    @Column({default : ''})
    image_url : string

    @Column()
    description : string

    @Column()
    slug : string

    @Column({default : 0})
    sold_count : number

    @ManyToOne(()=>CategoryEntity, (category)=>category.products)
    category : CategoryEntity
    //celler_id
    //category_id
}