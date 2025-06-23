import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Product } from './dto/entities/product.entity';
import { Variant } from './dto/entities/variant.entity';
import { Tag } from './dto/entities/tag.entity';
import { ProductMedia } from './dto/entities/product-media.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { Business } from '../business/entities/business.entity';
import { User } from '../auth/entities/user.entity';
import { StockHistory } from '../inventory/entities/stock-history.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Variant)
    private variantsRepository: Repository<Variant>,
    @InjectRepository(Tag)
    private tagsRepository: Repository<Tag>,
    @InjectRepository(ProductMedia)
    private mediaRepository: Repository<ProductMedia>,
    @InjectRepository(Business)
    private businessRepository: Repository<Business>,
    @InjectRepository(StockHistory)
    private stockHistoryRepository: Repository<StockHistory>,
  ) {}

  async create(createProductDto: CreateProductDto, userId: number) {
    const business = await this.businessRepository.findOne({ 
      where: { owner: { id: userId } },
      relations: ['owner'],
    });
    
    if (!business) {
      throw new NotFoundException('Business not found');
    }

    const {
      name,
      description,
      category,
      subcategory,
      price,
      discount,
      stock,
    } = createProductDto;

    const product = this.productsRepository.create({
      name,
      description,
      category,
      subcategory,
      price,
      discount,
      stock,
      business,
    });
    await this.productsRepository.save(product);


    if (createProductDto.variants && createProductDto.variants.length > 0) {
      const variants = createProductDto.variants.map(variantDto =>
        this.variantsRepository.create({
          ...variantDto,
          product,
        })
      );
      await this.variantsRepository.save(variants);
    }


    if (createProductDto.tags && createProductDto.tags.length > 0) {
      const tags = createProductDto.tags.map(tagName =>
        this.tagsRepository.create({
          name: tagName,
          product,
        })
      );
      await this.tagsRepository.save(tags);
    }


    if (createProductDto.images && createProductDto.images.length > 0) {
      const media = createProductDto.images.map(imageUrl =>
        this.mediaRepository.create({
          imageUrl,
          product,
        })
      );
      await this.mediaRepository.save(media);
    }


    if (createProductDto.model3d) {
      const model = this.mediaRepository.create({
        imageUrl: createProductDto.model3d,
        is3dModel: true,
        product,
      });
      await this.mediaRepository.save(model);
    }

    return this.productsRepository.findOne({
      where: { id: product.id },
      relations: ['variants', 'tags', 'media'],
    });
  }

  async findAll(userId: number) {
    const business = await this.businessRepository.findOne({ where: { owner: { id: userId } } });
    if (!business) {
      throw new NotFoundException('Business not found');
    }
    return this.productsRepository.find({
      where: { business: { id: business.id } },
      relations: ['variants', 'tags', 'media'],
    });
  }

  async findOne(id: number, userId: number) {
    const business = await this.businessRepository.findOne({ where: { owner: { id: userId } } });
    if (!business) {
      throw new NotFoundException('Business not found');
    }
    const product = await this.productsRepository.findOne({
      where: { id, business: { id: business.id } },
      relations: ['variants', 'tags', 'media', 'reviews'],
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async update(id: number, updateProductDto: Partial<CreateProductDto>, userId: number) {
  const business = await this.businessRepository.findOne({ where: { owner: { id: userId } } });
  if (!business) {
    throw new NotFoundException('Business not found');
  }

  const product = await this.productsRepository.findOne({
    where: { id, business: { id: business.id } },
  });
  if (!product) {
    throw new NotFoundException('Product not found');
  }

  const { tags, variants, images, ...productFields } = updateProductDto;


  if (Object.keys(productFields).length > 0) {
    await this.productsRepository.update(id, productFields);
  }

  return this.productsRepository.findOne({
    where: { id },
    relations: ['variants', 'tags', 'media'],
  });
}
  async remove(id: number, userId: number) {
    const business = await this.businessRepository.findOne({ where: { owner: { id: userId } } });
    if (!business) {
      throw new NotFoundException('Business not found');
    }

    const product = await this.productsRepository.findOne({
      where: { id, business: { id: business.id } },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.productsRepository.delete(id);
    return { message: 'Product deleted successfully' };
  }

  async addImages(id: number, imageUrls: string[], userId: number) {
    const business = await this.businessRepository.findOne({ where: { owner: { id: userId } } });
    if (!business) {
      throw new NotFoundException('Business not found');
    }

    const product = await this.productsRepository.findOne({
      where: { id, business: { id: business.id } },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const media = imageUrls.map(imageUrl =>
      this.mediaRepository.create({
        imageUrl,
        product,
      })
    );
    await this.mediaRepository.save(media);
    return this.mediaRepository.find({ where: { product: { id } } });
  }

  async removeImage(id: number, imageId: number, userId: number) {
    const business = await this.businessRepository.findOne({ where: { owner: { id: userId } } });
    if (!business) {
      throw new NotFoundException('Business not found');
    }

    const product = await this.productsRepository.findOne({
      where: { id, business: { id: business.id } },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.mediaRepository.delete({ id: imageId, product: { id } });
    return { message: 'Image deleted successfully' };
  }

  async getImages(id: number, userId: number) {
    const business = await this.businessRepository.findOne({ where: { owner: { id: userId } } });
    if (!business) {
      throw new NotFoundException('Business not found');
    }

    const product = await this.productsRepository.findOne({
      where: { id, business: { id: business.id } },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.mediaRepository.find({ 
      where: { product: { id }, is3dModel: false },
      order: { createdAt: 'ASC' },
    });
  }

  async add3dModel(id: number, modelUrl: string, userId: number) {
    const business = await this.businessRepository.findOne({ where: { owner: { id: userId } } });
    if (!business) {
      throw new NotFoundException('Business not found');
    }

    const product = await this.productsRepository.findOne({
      where: { id, business: { id: business.id } },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.mediaRepository.delete({ product: { id }, is3dModel: true });

    const model = this.mediaRepository.create({
      imageUrl: modelUrl,
      is3dModel: true,
      product,
    });
    await this.mediaRepository.save(model);
    return model;
  }

  async get3dModel(id: number, userId: number) {
    const business = await this.businessRepository.findOne({ where: { owner: { id: userId } } });
    if (!business) {
      throw new NotFoundException('Business not found');
    }

    const product = await this.productsRepository.findOne({
      where: { id, business: { id: business.id } },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.mediaRepository.findOne({ 
      where: { product: { id }, is3dModel: true },
    });
  }

  async getVariants(id: number, userId: number) {
    const business = await this.businessRepository.findOne({ where: { owner: { id: userId } } });
    if (!business) {
      throw new NotFoundException('Business not found');
    }

    const product = await this.productsRepository.findOne({
      where: { id, business: { id: business.id } },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.variantsRepository.find({ where: { product: { id } } });
  }

  async addVariant(id: number, variantData: Partial<Variant>, userId: number) {
    const business = await this.businessRepository.findOne({ where: { owner: { id: userId } } });
    if (!business) {
      throw new NotFoundException('Business not found');
    }

    const product = await this.productsRepository.findOne({
      where: { id, business: { id: business.id } },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const variant = this.variantsRepository.create({
      ...variantData,
      product,
    });
    await this.variantsRepository.save(variant);
    return variant;
  }

  async updateVariant(id: number, variantId: number, variantData: Partial<Variant>, userId: number) {
    const business = await this.businessRepository.findOne({ where: { owner: { id: userId } } });
    if (!business) {
      throw new NotFoundException('Business not found');
    }

    const product = await this.productsRepository.findOne({
      where: { id, business: { id: business.id } },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const variant = await this.variantsRepository.findOne({
      where: { id: variantId, product: { id } },
    });
    if (!variant) {
      throw new NotFoundException('Variant not found');
    }

    await this.variantsRepository.update(variantId, variantData);
    return this.variantsRepository.findOne({ where: { id: variantId } });
  }

  async removeVariant(id: number, variantId: number, userId: number) {
    const business = await this.businessRepository.findOne({ where: { owner: { id: userId } } });
    if (!business) {
      throw new NotFoundException('Business not found');
    }

    const product = await this.productsRepository.findOne({
      where: { id, business: { id: business.id } },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const variant = await this.variantsRepository.findOne({
      where: { id: variantId, product: { id } },
    });
    if (!variant) {
      throw new NotFoundException('Variant not found');
    }

    await this.variantsRepository.delete(variantId);
    return { message: 'Variant deleted successfully' };
  }

  async updateStock(id: number, stockData: { stock: number; variantId?: number }, userId: number) {
    const business = await this.businessRepository.findOne({ where: { owner: { id: userId } } });
    if (!business) {
      throw new NotFoundException('Business not found');
    }

    const product = await this.productsRepository.findOne({
      where: { id, business: { id: business.id } },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    let oldStock = 0;
    let entity;

    if (stockData.variantId) {
      const variant = await this.variantsRepository.findOne({
        where: { id: stockData.variantId, product: { id } },
      });
      if (!variant) {
        throw new NotFoundException('Variant not found');
      }
      oldStock = variant.stock || 0;
      variant.stock = stockData.stock;
      entity = variant;
      await this.variantsRepository.save(variant);
    } else {
      oldStock = product.stock;
      product.stock = stockData.stock;
      entity = product;
      await this.productsRepository.save(product);
    }

    
    const stockHistory = this.stockHistoryRepository.create({
      product: { id: product.id },
      variant: stockData.variantId ? { id: stockData.variantId } : undefined,
      oldStock,
      newStock: stockData.stock,
      changedBy: { id: userId },
    });
    await this.stockHistoryRepository.save(stockHistory);

    return entity;
  }

  async getStockHistory(id: number, userId: number) {
    const business = await this.businessRepository.findOne({ where: { owner: { id: userId } } });
    if (!business) {
      throw new NotFoundException('Business not found');
    }

    const product = await this.productsRepository.findOne({
      where: { id, business: { id: business.id } },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.stockHistoryRepository.find({
      where: { product: { id } },
      relations: ['variant', 'changedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async addTag(id: number, tagName: string, userId: number) {
    const business = await this.businessRepository.findOne({ where: { owner: { id: userId } } });
    if (!business) {
      throw new NotFoundException('Business not found');
    }

    const product = await this.productsRepository.findOne({
      where: { id, business: { id: business.id } },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const tag = this.tagsRepository.create({
      name: tagName,
      product,
    });
    await this.tagsRepository.save(tag);
    return tag;
  }

  async removeTag(id: number, tagId: number, userId: number) {
    const business = await this.businessRepository.findOne({ where: { owner: { id: userId } } });
    if (!business) {
      throw new NotFoundException('Business not found');
    }

    const product = await this.productsRepository.findOne({
      where: { id, business: { id: business.id } },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.tagsRepository.delete({ id: tagId, product: { id } });
    return { message: 'Tag deleted successfully' };
  }

  async updatePromotion(id: number, promoted: boolean, userId: number) {
    const business = await this.businessRepository.findOne({ where: { owner: { id: userId } } });
    if (!business) {
      throw new NotFoundException('Business not found');
    }

    const product = await this.productsRepository.findOne({
      where: { id, business: { id: business.id } },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    product.promoted = promoted;
    await this.productsRepository.save(product);
    return product;
  }

  async updateSeo(id: number, seoData: { slug: string }, userId: number) {
    const business = await this.businessRepository.findOne({ where: { owner: { id: userId } } });
    if (!business) {
      throw new NotFoundException('Business not found');
    }

    const product = await this.productsRepository.findOne({
      where: { id, business: { id: business.id } },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    product.slug = seoData.slug;
    await this.productsRepository.save(product);
    return product;
  }
}