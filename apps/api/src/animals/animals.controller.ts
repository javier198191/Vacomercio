import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, Query, BadRequestException, UseGuards } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AnimalsService } from './animals.service';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('animals')
export class AnimalsController {
  constructor(private readonly animalsService: AnimalsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FilesInterceptor('files', 5))
  create(
    @Body() createAnimalDto: CreateAnimalDto,
    @UploadedFiles() files: Express.Multer.File[],
    @CurrentUser() user: any,
  ) {
    // Overwrite userId with the authenticated user's ID
    createAnimalDto.userId = user.id;
    return this.animalsService.create(createAnimalDto, files || []);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @CurrentUser() user: any,
    @Query('loteId') loteId?: string,
  ) {
    return this.animalsService.findAll(user.id, loteId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.animalsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAnimalDto: UpdateAnimalDto) {
    return this.animalsService.update(id, updateAnimalDto);
  }

  @Patch(':id/marketplace')
  updateMarketplaceStatus(
    @Param('id') id: string,
    @Body('en_marketplace') en_marketplace: boolean,
    @Body('precio') precio?: number,
  ) {
    return this.animalsService.updateMarketplaceStatus(id, en_marketplace, precio);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.animalsService.remove(id);
  }
}
