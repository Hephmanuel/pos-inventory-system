import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

export enum MovementType {
  ADJUSTMENT = 'adjustment',
  SALE = 'sale',
  RETURN = 'return',
  RECEIPT = 'receipt',
}

@Entity('stock_movements')
export class StockMovement extends BaseEntity {
  @Column()
  sku_id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantity: number;

  @Column({nullable: true})
  reason: string;

  @Column({ type: 'enum', enum: MovementType })
  movement_type: MovementType;

  @Column({ nullable: true })
  reference_id: string;
}