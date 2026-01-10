import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post('checkout')
  checkout(@Body() createSaleDto: CreateSaleDto) {
    return this.salesService.checkout(createSaleDto);
  }

  @Get(':id')
  getReceipt(@Param('id') id: string) {
    return this.salesService.getReceipt(id);
  }
}