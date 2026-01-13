import { Entity, Column, ManyToOne, OneToOne, BaseEntity, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';
import { StockItem } from '../../inventory/entities/stock-item.entity'; 

@Entity('skus')
export class Sku extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  sku_code: string; 

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  base_price: number; 
 
  // If you ever get a product error, add @JoinColumn({ name: 'productid' }) here.
  @ManyToOne(() => Product, (product) => product.skus)
  product: Product; 

  @OneToOne(() => StockItem, (stockItem) => stockItem.sku)
  stock_item: StockItem;
}