// @ts-nocheck
import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('sales')
@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post('checkout')
  @ApiOperation({ summary: 'Process a new POS transaction' })
  @ApiResponse({ status: 201, description: 'Transaction processed successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  checkout(@Body() createSaleDto: CreateSaleDto) {
    return this.salesService.checkout(createSaleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all POS transactions' })
  @ApiResponse({ status: 200, description: 'Transactions retrieved successfully' })
  @ApiResponse({ status: 404, description: 'No transactions found' })
  findAll() {
    return this.salesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific POS transaction by ID' })
  @ApiResponse({ status: 200, description: 'Transaction retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  getReceipt(@Param('id') id: string) {
    return this.salesService.getReceipt(id);
  }
}