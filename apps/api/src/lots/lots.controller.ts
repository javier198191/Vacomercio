import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { LotsService } from './lots.service';
import { CreateLotDto } from './dto/create-lot.dto';

@Controller('lots')
export class LotsController {
  constructor(private readonly lotsService: LotsService) {}

  @Post('create-dynamic')
  createDynamic(@Body() createLotDto: CreateLotDto) {
    return this.lotsService.createDynamic(createLotDto);
  }

  @Get()
  findAll() {
    return this.lotsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lotsService.findOne(id);
  }
}
