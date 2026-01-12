// @ts-nocheck
import { Controller, Post, Get, Body, Patch, Param, Delete } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('catalog')


@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Post('products')
  @ApiOperation({ summary: 'Create a new product with SKUs' })
  @ApiResponse({ status: 201, description: 'Product and SKUs created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() createProductDto: CreateProductDto) {
    return this.catalogService.create(createProductDto);
  }

  @Get('products')
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  @ApiResponse({ status: 404, description: 'No products found' })
  findAll() {
    return this.catalogService.findAllProducts();
  }

  @Get('skus/:sku_code')
  @ApiOperation({ summary: 'Get a specific SKU by code' })
  @ApiResponse({ status: 200, description: 'SKU retrieved successfully' })
  @ApiResponse({ status: 404, description: 'SKU not found' })
  findOneSku(@Param('sku_code') skuCode: string) {
    return this.catalogService.findSkuByCode(skuCode);
  }

  @Patch('skus/:id/price')
  @ApiOperation({ summary: 'Update the price of a specific SKU' })
  @ApiResponse({ status: 200, description: 'SKU price updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  updateSkuPrice(@Param('id') id: string, @Body('price') newPrice: number) {
    return this.catalogService.updateSkuPrice(id, newPrice);
  }

  @Get()
  @ApiOperation({ summary: 'Get a welcome message' })
  @ApiResponse({ status: 200, description: 'Welcome message' })
  getWelcomeMessage() {
    return 'Welcome to the Catalog Module';
  }

  @Patch('products/:id')
  @ApiOperation({ summary: 'Update product details' })
  updateProduct(@Param('id') id: string, @Body() body: Partial<CreateProductDto>) {
    return this.catalogService.updateProduct(id, body);
  }

  @Delete('products/:id')
  @ApiOperation({ summary: 'Deactivate/Delete a product' })
  delete(@Param('id') id: string) {
    return this.catalogService.deleteProduct(id);
  }
}