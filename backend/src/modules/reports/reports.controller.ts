import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('sales')
  getSalesReport(@Query() criteria: any) {
    //return this.reportsService.generateSalesReport(criteria); 
  }

  @Get('inventory')
  getInventoryReport(@Query() criteria: any) {
    //return this.reportsService.generateInventoryReport(criteria); 
  }
}