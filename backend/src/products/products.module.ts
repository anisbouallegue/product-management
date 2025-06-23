import { Module, forwardRef } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './dto/entities/product.entity';
import { Variant } from './dto/entities/variant.entity';
import { Tag } from './dto/entities/tag.entity';
import { ProductMedia } from './dto/entities/product-media.entity';
import { BusinessModule } from '../business/business.module';
import { AuthModule } from '../auth/auth.module';
import { StockHistory } from '../inventory/entities/stock-history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Variant, Tag, ProductMedia, StockHistory]),
    forwardRef(() => BusinessModule),
    forwardRef(() => AuthModule),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}