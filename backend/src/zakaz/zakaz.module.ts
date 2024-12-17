import { Module } from '@nestjs/common';
import { ZakazService } from './zakaz.service';
import { ZakazController } from './zakaz.controller';

@Module({
  controllers: [ZakazController],
  providers: [ZakazService],
})
export class ZakazModule {}
