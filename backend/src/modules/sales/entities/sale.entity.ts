import { Entity, Column, OneToMany, Generated } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { SaleLine } from './sale-line.entity';

@Entity('sales')
export class Sale extends BaseEntity {
  @Column()
  employee_id: string; 

  @Column({ unique: true })
  @Generated('increment')
  receipt_index: number; 

  @Column({ nullable: true })
  receipt_id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_amount: number; 

  @OneToMany(() => SaleLine, (line) => line.sale)
  lines: SaleLine[]; 
}