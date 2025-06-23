import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Product } from '../../products/dto/entities/product.entity';
import { Variant } from '../../products/dto/entities/variant.entity';
import { User } from '../../auth/entities/user.entity';

@Entity()
export class StockHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product)
  product: Product;

  @ManyToOne(() => Variant, { nullable: true })
  variant: Variant;

  @Column()
  oldStock: number;

  @Column()
  newStock: number;

  @ManyToOne(() => User)
  changedBy: User;

  @CreateDateColumn()
  createdAt: Date;
}