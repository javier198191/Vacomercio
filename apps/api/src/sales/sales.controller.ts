import { Controller, Post, Body, Get } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post('mark-sold')
  markAsSold(@Body() createSaleDto: CreateSaleDto) {
    return this.salesService.markAsSold(createSaleDto);
  }

  @Get()
  findAll() {
    return this.salesService.findAll();
  }
}
