import { UserEntity } from "../user.entity"

export type UserType = {
    user : UserEntity & {token : string}
}
