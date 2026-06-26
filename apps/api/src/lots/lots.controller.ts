import { Controller, Get, Post, Body, Param, UseInterceptors, UploadedFiles, BadRequestException } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { LotsService } from './lots.service';
import { CreateLotDto } from './dto/create-lot.dto';

@Controller('lots')
export class LotsController {
  constructor(private readonly lotsService: LotsService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files', 5))
  create(
    @Body() createLotDto: CreateLotDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Debe subir al menos una foto obligatoriamente para poder publicar.');
    }
    return this.lotsService.create(createLotDto, files);
  }

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
