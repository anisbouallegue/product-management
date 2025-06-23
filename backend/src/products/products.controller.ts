import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { User } from '../auth/decorators/user.decorator';
import { Variant } from './dto/entities/variant.entity';

@ApiTags('products')
@ApiBearerAuth()
@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto, @User() user: any) {
    return this.productsService.create(createProductDto, user.userId);
  }

  @Get()
  findAll(@User() user: any) {
    return this.productsService.findAll(user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @User() user: any) {
    return this.productsService.findOne(+id, user.userId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateProductDto: Partial<CreateProductDto>, @User() user: any) {
    return this.productsService.update(+id, updateProductDto, user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: any) {
    return this.productsService.remove(+id, user.userId);
  }

  @Post(':id/gallery')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('files'))
  async uploadImages(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @User() user: any,
  ) {
    const imageUrls = files.map(file => `/uploads/${file.filename}`);
    return this.productsService.addImages(+id, imageUrls, user.userId);
  }

  @Delete(':id/gallery/:imageId')
  removeImage(@Param('id') id: string, @Param('imageId') imageId: string, @User() user: any) {
    return this.productsService.removeImage(+id, +imageId, user.userId);
  }

  @Get(':id/gallery')
  getImages(@Param('id') id: string, @User() user: any) {
    return this.productsService.getImages(+id, user.userId);
  }

  @Post(':id/3dmodel')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('file'))
  async upload3dModel(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @User() user: any,
  ) {
    const modelUrl = `/uploads/3dmodels/${files[0].filename}`;
    return this.productsService.add3dModel(+id, modelUrl, user.userId);
  }

  @Get(':id/3dmodel')
  get3dModel(@Param('id') id: string, @User() user: any) {
    return this.productsService.get3dModel(+id, user.userId);
  }

  @Get(':id/variants')
  getVariants(@Param('id') id: string, @User() user: any) {
    return this.productsService.getVariants(+id, user.userId);
  }

  @Post(':id/variants')
  addVariant(@Param('id') id: string, @Body() variantData: Partial<Variant>, @User() user: any) {
    return this.productsService.addVariant(+id, variantData, user.userId);
  }

  @Put(':id/variants/:variantId')
  updateVariant(
    @Param('id') id: string,
    @Param('variantId') variantId: string,
    @Body() variantData: Partial<Variant>,
    @User() user: any,
  ) {
    return this.productsService.updateVariant(+id, +variantId, variantData, user.userId);
  }

  @Delete(':id/variants/:variantId')
  removeVariant(@Param('id') id: string, @Param('variantId') variantId: string, @User() user: any) {
    return this.productsService.removeVariant(+id, +variantId, user.userId);
  }

  @Put(':id/stock')
  updateStock(@Param('id') id: string, @Body() stockData: { stock: number; variantId?: number }, @User() user: any) {
    return this.productsService.updateStock(+id, stockData, user.userId);
  }

  @Get(':id/stock/history')
  getStockHistory(@Param('id') id: string, @User() user: any) {
    return this.productsService.getStockHistory(+id, user.userId);
  }

  @Post(':id/tag')
  addTag(@Param('id') id: string, @Body() { name }: { name: string }, @User() user: any) {
    return this.productsService.addTag(+id, name, user.userId);
  }

  @Delete(':id/tag/:tagId')
  removeTag(@Param('id') id: string, @Param('tagId') tagId: string, @User() user: any) {
    return this.productsService.removeTag(+id, +tagId, user.userId);
  }

  @Put(':id/promotion')
  updatePromotion(@Param('id') id: string, @Body() { promoted }: { promoted: boolean }, @User() user: any) {
    return this.productsService.updatePromotion(+id, promoted, user.userId);
  }

  @Put(':id/seo')
  updateSeo(@Param('id') id: string, @Body() { slug }: { slug: string }, @User() user: any) {
    return this.productsService.updateSeo(+id, { slug }, user.userId);
  }
}