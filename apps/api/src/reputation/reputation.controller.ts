import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ReputationService } from './reputation.service';
import { CreateRatingDto } from './dto/create-rating.dto';

@Controller('reputation')
export class ReputationController {
  constructor(private readonly reputationService: ReputationService) {}

  @Post('rate')
  submitRating(@Body() createRatingDto: CreateRatingDto) {
    return this.reputationService.submitRating(createRatingDto);
  }

  @Get('user/:userId')
  getRatingsForUser(@Param('userId') userId: string) {
    return this.reputationService.getRatingsForUser(userId);
  }
}
