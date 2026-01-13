import { Entity, Column, Index, OneToOne, JoinColumn, BaseEntity, PrimaryGeneratedColumn } from 'typeorm'; 
import { Sku } from '../../catalog/entities/sku.entity';

@Entity('stock_items')
@Index(['sku_id', 'store_id'], { unique: true })
export class StockItem extends BaseEntity {
  
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @OneToOne(() => Sku, (sku) => sku.stock_item)
  @JoinColumn({ name: 'sku_id' })
  sku: Sku;
}