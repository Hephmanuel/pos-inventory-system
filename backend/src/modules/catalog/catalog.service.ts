import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { Sku } from './entities/sku.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class CatalogService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(Sku) private skuRepo: Repository<Sku>,
  ) {}
  // Create the new Product
  async createProductWithSkus(dto: CreateProductDto) {
    const newProduct = this.productRepo.create({
      name: dto.name,
      description: dto.description,
    });
    const savedProduct = await this.productRepo.save(newProduct);

    // Create the associated SKUs
    const skuEntities = dto.skus.map((skuDto) => {
      return this.skuRepo.create({
        sku_code: skuDto.sku_code,
        base_price: skuDto.price,
        product: savedProduct,
      });
    });
    await this.skuRepo.save(skuEntities);
    return {message: 'Product and SKUs created successfully', product: savedProduct, skus: skuEntities};
  }

  async findAllProducts() {
    return this.productRepo.find({ relations: ['skus'] });
  }

  async findSkuByCode(skuCode: string) {
    return this.skuRepo.findOne({ where: { sku_code: skuCode } });
  }

  async updateSkuPrice(id: string, newPrice: number) {
    const sku = await this.skuRepo.findOne({ where: { id } });

    if (!sku) {
      throw new Error('SKU not found');
    }
    sku.base_price = newPrice;
    return this.skuRepo.save(sku);
  }
}