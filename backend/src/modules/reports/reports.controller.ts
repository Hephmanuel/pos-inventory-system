// @ts-nocheck
import { Controller, Get, Query } from '@nestjs/common'; // FIX: Added Query
import { ReportsService } from './reports.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('reports')


@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('sales-summary')
  @ApiOperation({ summary: 'Get daily sales summary' })
  @ApiResponse({ status: 200, description: 'Sales summary retrieved successfully' })
  @ApiResponse({ status: 404, description: 'No sales found' })
  getSalesSummary(@Query('date') date: string) {
    return this.reportsService.getDailySummary(date);
  }

  @Get('top-selling-products')
  @ApiOperation({ summary: 'Get top selling products' })
  @ApiResponse({ status: 200, description: 'Top selling products retrieved successfully' })
  @ApiResponse({ status: 404, description: 'No products found' })
  getTopSelling(
    @Query('limit') limit: number, 
    @Query('start_date') start: string, 
    @Query('end_date') end: string
  ) {
    return this.reportsService.getTopSellingProducts(limit, start, end);
  }

  @Get('daily-summary')
  @ApiOperation({ summary: 'Get daily sales summary' })
  @ApiResponse({ status: 200, description: 'Daily summary retrieved successfully' })
  @ApiResponse({ status: 404, description: 'No sales found' })
  getDaily(@Query('date') date: string) {
    return this.reportsService.getDailySummary(date);
  }

  @Get('sales-over-time')
  @ApiOperation({ summary: 'Get sales over time' })
  @ApiResponse({ status: 200, description: 'Sales over time retrieved successfully' })
  @ApiResponse({ status: 404, description: 'No sales found' })
  getOverTime(
    @Query('start_date') start: string, 
    @Query('end_date') end: string
  ) {
    return this.reportsService.getSalesOverTime(start, end);
  }
}


 // NOTE: Removed getInventoryStatus as it is not yet implemented in the service
  /* @Get('inventory-status')
  getInventoryStatus() {
    return this.reportsService.getInventoryStatus();
  } */