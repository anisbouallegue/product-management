import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Review } from './review.entity';

@Entity()
export class ReviewPhoto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  photoUrl: string;

  @ManyToOne(() => Review, review => review.photos, { onDelete: 'CASCADE' })
  review: Review;

  @CreateDateColumn()
  createdAt: Date;
}