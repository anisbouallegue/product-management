import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from '../auth/decorators/user.decorator';

@ApiTags('reviews')
@ApiBearerAuth()
@Controller('products/:id/reviews')
@UseGuards(JwtAuthGuard)
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  findAll(@Param('id') productId: string) {
    return this.reviewsService.findAll(+productId);
  }

  @Post()
  create(
    @Param('id') productId: string,
    @Body() createReviewDto: CreateReviewDto,
    @User() user: any,
  ) {
    return this.reviewsService.create(+productId, createReviewDto, user.userId);
  }

  @Put(':reviewId')
  update(
    @Param('id') productId: string,
    @Param('reviewId') reviewId: string,
    @Body() updateReviewDto: Partial<CreateReviewDto>,
    @User() user: any,
  ) {
    return this.reviewsService.update(+productId, +reviewId, updateReviewDto, user.userId);
  }

  @Delete(':reviewId')
  remove(
    @Param('id') productId: string,
    @Param('reviewId') reviewId: string,
    @User() user: any,
  ) {
    return this.reviewsService.remove(+productId, +reviewId, user.userId);
  }

  @Get('rating-breakdown')
  getRatingBreakdown(@Param('id') productId: string) {
    return this.reviewsService.getRatingBreakdown(+productId);
  }
}