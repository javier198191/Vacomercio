import { Controller, Get, Query } from '@nestjs/common';
import { MarketplaceService, FeedQueryDto } from './marketplace.service';

@Controller('marketplace')
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Get('feed')
  getFeed(
    @Query('departamento') departamento?: string,
    @Query('region') region?: string,
    @Query('priceCategory') priceCategory?: 'LEVANTE' | 'COMERCIAL' | 'ELITE',
    @Query('tipo') tipo?: 'individual' | 'lote',
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.marketplaceService.getFeed({
      departamento,
      region,
      priceCategory,
      tipo,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }
}
