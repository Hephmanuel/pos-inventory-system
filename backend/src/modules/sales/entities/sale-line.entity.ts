import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Sale } from './sale.entity';

@Entity('sale_lines')
export class SaleLine extends BaseEntity {
  @ManyToOne(() => Sale, (sale) => sale.lines)
  sale: Sale; // Links to the master transaction 

  @Column()
  sku_id: string; // The specific item sold 

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantity: number; // Quantity sold (must be ≥ 1) 

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unit_price: number; // Price "frozen" at time of sale 
}