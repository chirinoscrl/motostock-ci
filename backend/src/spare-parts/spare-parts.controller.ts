import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateSparePartDto } from './dto/create-spare-part.dto';
import { SparePartsService } from './spare-parts.service';

@Controller('spare-parts')
export class SparePartsController {
  constructor(private readonly sparePartsService: SparePartsService) {}

  @Post()
  create(@Body() dto: CreateSparePartDto) {
    return this.sparePartsService.create(dto);
  }

  @Get()
  findAll() {
    return this.sparePartsService.findAll();
  }
}
