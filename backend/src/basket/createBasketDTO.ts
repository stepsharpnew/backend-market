import { ApiProperty } from "@nestjs/swagger";

export class CreateBasketDTO {
    @ApiProperty({example : "1", description : "АйДи пользователя"})
    userId : number
}