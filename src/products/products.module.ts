import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './products.entity';
import { CategoryEntity } from 'src/entitys/category.entity';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { FileModule } from 'src/file/file.module';
import { FileService } from 'src/file/file.service';

@Module({
  imports : [TypeOrmModule.forFeature([
    ProductEntity,
    CategoryEntity,
    UserModule
  ]),
  FileModule
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
