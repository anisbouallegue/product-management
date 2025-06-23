import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { ReviewPhoto } from './entities/review-photo.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { ProductsService } from '../products/products.service';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
    @InjectRepository(ReviewPhoto)
    private reviewPhotosRepository: Repository<ReviewPhoto>,
    private productsService: ProductsService,
  ) {}

  async findAll(productId: number) {
    return this.reviewsRepository.find({
      where: { product: { id: productId } },
      relations: ['user', 'photos'],
    });
  }

  async create(productId: number, createReviewDto: CreateReviewDto, userId: number) {
    const review = this.reviewsRepository.create({
      ...createReviewDto,
      product: { id: productId },
      user: { id: userId },
    });
    await this.reviewsRepository.save(review);
    
  
    await this.updateProductRating(productId);
    
    return review;
  }

  async update(productId: number, reviewId: number, updateReviewDto: Partial<CreateReviewDto>, userId: number) {
    const review = await this.reviewsRepository.findOne({
      where: { id: reviewId, product: { id: productId }, user: { id: userId } },
    });
    if (!review) {
      throw new NotFoundException('Review not found');
    }

    await this.reviewsRepository.update(reviewId, updateReviewDto);
    
   
    if (updateReviewDto.rating) {
      await this.updateProductRating(productId);
    }
    
    return this.reviewsRepository.findOne({
      where: { id: reviewId },
      relations: ['user', 'photos'],
    });
  }

  async remove(productId: number, reviewId: number, userId: number) {
    const review = await this.reviewsRepository.findOne({
      where: { id: reviewId, product: { id: productId }, user: { id: userId } },
    });
    if (!review) {
      throw new NotFoundException('Review not found');
    }

    await this.reviewsRepository.delete(reviewId);
    
    await this.updateProductRating(productId);
    
    return { message: 'Review deleted successfully' };
  }

  async getRatingBreakdown(productId: number) {
    const result = await this.reviewsRepository
      .createQueryBuilder('review')
      .select('review.rating', 'rating')
      .addSelect('COUNT(review.id)', 'count')
      .where('review.productId = :productId', { productId })
      .groupBy('review.rating')
      .orderBy('review.rating', 'DESC')
      .getRawMany();

    const total = result.reduce((sum, item) => sum + +item.count, 0);
    const average = result.reduce((sum, item) => sum + (item.rating * item.count), 0) / total || 0;

    return {
      average,
      breakdown: result,
      total,
    };
  }

  private async updateProductRating(productId: number) {
    const result = await this.reviewsRepository
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'average')
      .where('review.productId = :productId', { productId })
      .getRawOne();

    await this.productsService.update(productId, { rating: parseFloat(result.average) || 0 }, 0);
  }
}