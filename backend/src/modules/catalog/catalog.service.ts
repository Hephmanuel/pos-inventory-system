import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { Sku } from './entities/sku.entity';

@Injectable()
export class CatalogService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(Sku) private skuRepo: Repository<Sku>,
  ) {}
}