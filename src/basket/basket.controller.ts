import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { BasketService } from './basket.service';
import { AccesTokenGeard } from 'src/guards/accessToken.guard';
import { User } from 'src/user/decorators/UserDecorator';

@Controller('basket')
export class BasketController {
  constructor(private readonly basketService: BasketService) {}


  @Get()
  @UseGuards(AccesTokenGeard)
  async getBasketUser(
    @User('id') user_id : number,
    
  ){
    // const basket = await this.basketService.getBasketUser(user_id)
    // return basket
  }

  @Post('create')
  @UseGuards(AccesTokenGeard)
  async productToBasket(@User()user_id : any, @Body() product_id:any){
    const new_record = await this.basketService.addProdToBasket(user_id.sub,product_id.product_id)
    console.log('sosat',new_record);
    return new_record
    
  }
}
