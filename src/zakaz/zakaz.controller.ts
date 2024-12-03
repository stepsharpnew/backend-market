import { Controller } from '@nestjs/common';
import { ZakazService } from './zakaz.service';

@Controller('zakaz')
export class ZakazController {
  constructor(private readonly zakazService: ZakazService) {}
}
