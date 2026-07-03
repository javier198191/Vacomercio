import { Controller, Get, Post, Body, Param, UseInterceptors, UploadedFiles, Query, Patch, Delete, BadRequestException, UseGuards } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { LotsService } from './lots.service';
import { CreateLotDto } from './dto/create-lot.dto';
import { UpdateLotDto } from './dto/update-lot.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('lots')
export class LotsController {
  constructor(private readonly lotsService: LotsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FilesInterceptor('files', 5))
  create(
    @Body() createLotDto: CreateLotDto,
    @UploadedFiles() files: Express.Multer.File[],
    @CurrentUser() user: any,
  ) {
    // Overwrite userId with the authenticated user's ID
    createLotDto.userId = user.id;
    // Files are optional for internal lot management
    return this.lotsService.create(createLotDto, files || []);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create-dynamic')
  createDynamic(
    @Body() createLotDto: CreateLotDto,
    @CurrentUser() user: any,
  ) {
    // Overwrite userId with the authenticated user's ID
    createLotDto.userId = user.id;
    return this.lotsService.createDynamic(createLotDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@CurrentUser() user: any) {
    return this.lotsService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lotsService.findOne(id);
  }

  @Patch(':id/assign-animals')
  assignAnimals(
    @Param('id') id: string,
    @Body('animalIds') animalIds: string[],
  ) {
    return this.lotsService.assignAnimals(id, animalIds);
  }

  @Patch(':id/marketplace')
  updateMarketplaceStatus(
    @Param('id') id: string,
    @Body('en_marketplace') en_marketplace: boolean,
    @Body('precio') precio?: number,
  ) {
    return this.lotsService.updateMarketplaceStatus(id, en_marketplace, precio);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLotDto: UpdateLotDto,
  ) {
    return this.lotsService.update(id, updateLotDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lotsService.remove(id);
  }
}
