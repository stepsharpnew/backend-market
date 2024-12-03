import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { BasketService } from './basket.service';
import { AccesTokenGeard } from 'src/guards/accessToken.guard';
import { User } from 'src/user/decorators/UserDecorator';

@Controller('basket')
export class BasketController {
  constructor(private readonly basketService: BasketService) {}


  @Get()
  @UseGuards(AccesTokenGeard)
  async getBasketUser(
    @User() user_id : any,
  ){
    const basket = await this.basketService.getBasketUser(user_id.sub)
    return basket
  }

  @Post('create')
  @UseGuards(AccesTokenGeard)
  async productToBasket(@User()user_id : any, @Body('product_id') product_id:number){
    const new_record = await this.basketService.addProdToBasket(user_id.sub ,product_id )
    return new_record
  }

  @Delete('delete')
  @UseGuards(AccesTokenGeard)
  async deleteBasket(@User()user_id : any){
    const deleted = await this.basketService.deleteBasket(user_id.sub )
    return deleted
  }



  @Post('buy')
  @UseGuards(AccesTokenGeard)

  async basketToZakaz(@User()user_id : any){
    const zakaz = await this.basketService.basketToZakaz(user_id.sub )
    return zakaz
  }

}
