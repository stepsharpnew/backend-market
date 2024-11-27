import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name : 'users'})

export class UserEntity{

    @PrimaryGeneratedColumn()
    id : number

    @Column()
    email : string

    @Column()
    password : string

    @Column({default : ''})
    image_url : string

    @Column({default : 'user'})
    role : string

    @Column({default : '',nullable : true})
    refreshToken : string

}