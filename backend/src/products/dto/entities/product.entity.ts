import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Business } from '../../../business/entities/business.entity';
import { Variant } from './variant.entity';
import { Review } from '../../../reviews/entities/review.entity';
import { Tag } from './tag.entity';
import { ProductMedia } from './product-media.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column('text')
  description: string;

  @Column()
  category: string;

  @Column({ nullable: true })
  subcategory: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  discount: number;

  @Column({ default: 0 })
  stock: number;

  @Column('decimal', { precision: 3, scale: 2, default: 0 })
  rating: number;

  @ManyToOne(() => Business, business => business.products)
  business: Business;

  @Column({ default: false })
  promoted: boolean;

  @OneToMany(() => ProductMedia, media => media.product)
  media: ProductMedia[];

  @OneToMany(() => Variant, variant => variant.product)
  variants: Variant[];

  @OneToMany(() => Tag, tag => tag.product)
  tags: Tag[];

  @OneToMany(() => Review, review => review.product)
  reviews: Review[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}