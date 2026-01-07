// @ts-nocheck
import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { StaffService } from './staff.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post()
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.staffService.create(createEmployeeDto);
  }

  @Get()
  findAll() {
    return this.staffService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.staffService.findOne(id);
  }

  // NEW: Update Staff (e.g., Reset Password)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.staffService.update(id, updateEmployeeDto);
  }

  // NEW: Delete Staff (Fire/Remove)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.staffService.remove(id);
  }
}