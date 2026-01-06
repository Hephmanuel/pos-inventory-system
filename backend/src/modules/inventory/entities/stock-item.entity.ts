import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('stock_items')
@Index(['sku_id', 'store_id'], { unique: true })
export class StockItem extends BaseEntity {
  @Column()
  sku_id: string; 

  @Column()
  store_id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  quantity_available: number; 

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  quantity_reserved: number; 

  @Column({ name: 'location', nullable: true })
  location: string;
}