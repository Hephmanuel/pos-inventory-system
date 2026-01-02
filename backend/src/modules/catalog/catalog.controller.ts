import { Controller, Post, Get, Body, Patch, Param } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Post('products')
  create(@Body() body: CreateProductDto) {
    return this.catalogService.createProductWithSkus(body);
  }

  @Get('products')
  findAll() {
    return this.catalogService.findAllProducts();
  }

  @Get('skus/:sku_code')
  findOneSku(@Param('sku_code') skuCode: string) {
    return this.catalogService.findSkuByCode(skuCode);
  }

  @Patch('skus/:id/price')
  updateSkuPrice(@Param('id') id: string, @Body('price') newPrice: number) {
    return this.catalogService.updateSkuPrice(id, newPrice);
  }

  // 👇 PASTE THIS PART INSIDE THE CLASS 👇
  @Get()
  getWelcomeMessage() {
    return 'Welcome to the Catalog Module';
  }
}