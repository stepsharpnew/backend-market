import { Controller, Get, UseGuards } from '@nestjs/common';
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
    const basket = await this.basketService.getBasketUser(user_id)
    return basket
  }
}
