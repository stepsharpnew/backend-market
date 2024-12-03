import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from 'src/products/products.entity';
import { UserEntity } from 'src/user/user.entity';

@Module({
  imports : [TypeOrmModule.forFeature([ProductEntity,UserEntity])],
  controllers: [FileController],
  providers: [FileService],
  exports : [FileService]
})
export class FileModule {}
