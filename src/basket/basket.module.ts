import { Module } from '@nestjs/common';
import { BasketService } from './basket.service';
import { BasketController } from './basket.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';
import { ProductEntity } from 'src/products/products.entity';
import { BasketProductsEntity } from 'src/entitys/basket_products.entity';

@Module({
  imports : [TypeOrmModule.forFeature([UserEntity,ProductEntity,BasketProductsEntity])],
  controllers: [BasketController],
  providers: [BasketService],
  exports : [BasketService]
})
export class BasketModule {}
