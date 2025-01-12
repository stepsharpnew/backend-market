import { ApiProperty } from "@nestjs/swagger"

export class FilterDTO{
    @ApiProperty({example : 60000, description : "Максимальная цена"})
    price_up ?: number

    @ApiProperty({example : 50000, description : "Минимальная цена"})
    price_bottom ?: number


}