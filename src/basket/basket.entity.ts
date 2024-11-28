import { UserEntity } from "src/user/user.entity";
import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name : 'basket'})

export class BasketEntity{
    @PrimaryGeneratedColumn()
    id : number

    @OneToOne(()=>UserEntity)
    @JoinColumn({name : 'user'})
    user : number

    // @ManyToMany(()=>ProductEntity)
    // @JoinTable()
    // products : ProductEntity[]
}