import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { BasketService } from './basket.service';
import { AccesTokenGeard } from 'src/guards/accessToken.guard';
import { User } from 'src/user/decorators/UserDecorator';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ProductEntity } from 'src/products/products.entity';
import { BasketProductsEntity } from 'src/entitys/basket_products.entity';
import { ZakazEntity } from 'src/zakaz/zakaz.entity';


@ApiTags('Корзина')
@ApiBearerAuth()
@Controller('basket')
export class BasketController {
  constructor(private readonly basketService: BasketService) {}


  @Get()
  @ApiOperation({summary : "Получение товаров в корзине"})
  @ApiResponse({status : 200, type : [ProductEntity] })
  @UseGuards(AccesTokenGeard)
  async getBasketUser(
    @User() user_id : any,
  ){
    const basket = await this.basketService.getBasketUser(user_id.sub)
    return basket
  }

  @ApiOperation({summary : "Добавление товара в корзину"})
  @ApiResponse({status : 200, type : BasketProductsEntity })
  @Post('create')
  @UseGuards(AccesTokenGeard)
  @ApiBody({schema : {properties : {product_id : { example : 1},count : {example : 2} }}})
  async productToBasket(@User()user_id : any, @Body('product_id') product_id:number,@Body('count') count:number){
    const new_record = await this.basketService.addProdToBasket(user_id.sub ,product_id, count )
    return new_record
  }

  @ApiOperation({summary : "Очистка корзины"})
  @ApiResponse({status : 200, example : "good"})
  @Delete('delete')
  @UseGuards(AccesTokenGeard)
  async deleteBasket(@User()user_id : any){
    const deleted = await this.basketService.deleteBasket(user_id.sub )
    return deleted
  }


  @ApiOperation({summary : "Покупка товарв"})
  @ApiResponse({status : 200, type : ZakazEntity })
  @Post('buy')
  @UseGuards(AccesTokenGeard)

  async basketToZakaz(@User()user_id : any){
    const zakaz = await this.basketService.basketToZakaz(user_id.sub )
    return zakaz
  }


  @ApiOperation({summary : "Количество товаров"})
  @ApiResponse({status : 200, type : ZakazEntity })
  @Get('count')
  @UseGuards(AccesTokenGeard)
  async productCols(@User()user_id : any){
    const counts = await this.basketService.productCount(user_id.sub )
    return counts
  }

  @ApiOperation({summary : "Изменение количества в бакете"})
  @ApiResponse({status : 200, type : ZakazEntity })
  @Post('count_change')
  @ApiBody({schema : {properties : {count : {example : 2},type : {example : true}}}})
  @UseGuards(AccesTokenGeard)
  async countChange(@User()user_id : any,@Body('count') count:number,@Body('type') type : boolean){
    console.log(count);
    
    const counts = await this.basketService.countChange(user_id.sub, count, type )
    return counts
  }

}
