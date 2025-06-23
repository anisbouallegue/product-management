import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Product } from '../../products/dto/entities/product.entity';
import { User } from '../../auth/entities/user.entity';
import { ReviewPhoto } from './review-photo.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, product => product.reviews)
  product: Product;

  @ManyToOne(() => User)
  user: User;

  @Column()
  rating: number;

  @Column('text', { nullable: true })
  comment: string;

  @Column({ default: 0 })
  helpfulVotes: number;

  @OneToMany(() => ReviewPhoto, photo => photo.review)
  photos: ReviewPhoto[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}