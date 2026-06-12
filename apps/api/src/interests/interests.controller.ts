import { Controller, Post, Body, Get } from '@nestjs/common';
import { InterestsService } from './interests.service';
import { CreateInterestDto } from './dto/create-interest.dto';

@Controller('interests')
export class InterestsController {
  constructor(private readonly interestsService: InterestsService) {}

  @Post()
  create(@Body() createInterestDto: CreateInterestDto) {
    return this.interestsService.create(createInterestDto);
  }

  @Get()
  findAll() {
    return this.interestsService.findAll();
  }
}
