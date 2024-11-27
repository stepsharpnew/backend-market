import { ProductEntity } from "src/products/products.entity";
import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity({name : 'categories'})

export class CategoryEntity{

    @PrimaryGeneratedColumn()
    id : number

    @Column()
    category : string

    @Column()
    short_name : string

    @OneToMany(()=> ProductEntity, (product)=>product.category)
    products : ProductEntity[]
}