// @ts-nocheck
import { Controller, Get, Post, Body } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { AdjustStockDto } from './dto/adjust-stock.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('inventory')



@Controller('inventory') // This makes the URL: /api/v1/inventory
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('stock-levels')
  @ApiOperation({ summary: 'Get current stock levels' })
  @ApiResponse({ status: 200, description: 'Stock levels retrieved successfully' })
  @ApiResponse({ status: 404, description: 'No stock levels found' })
  findAll() {
    return this.inventoryService.getStockLevels();
  }

  @Post('adjust')
  @ApiOperation({ summary: 'Adjust stock' })
  @ApiResponse({ status: 201, description: 'Stock adjusted successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  adjust(@Body() dto: AdjustStockDto) {
    return this.inventoryService.adjustStock(dto);
  }
}