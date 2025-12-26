import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Sku } from './sku.entity';

@Entity('products')
export class Product extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string; 

  @Column({ default: true })
  active: boolean; 

@OneToMany(() => Sku, (sku: Sku) => sku.product)
skus: Sku[];
}