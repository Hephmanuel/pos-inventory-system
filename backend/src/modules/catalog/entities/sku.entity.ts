import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Product } from './product.entity';

@Entity('skus')
export class Sku extends BaseEntity {
  @Column({ unique: true })
  sku_code: string; 

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  base_price: number; 

  @ManyToOne(() => Product, (product) => product.skus)
  product: Product; 
}