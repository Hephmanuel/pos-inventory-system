// @ts-nocheck
import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { StaffService } from './staff.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('staff')

@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new staff member' }) 
  @ApiResponse({ status: 201, description: 'Staff member created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.staffService.create(createEmployeeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all staff members' })
  @ApiResponse({ status: 200, description: 'Staff members retrieved successfully' })
  @ApiResponse({ status: 404, description: 'No staff members found' })
  findAll() {
    return this.staffService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific staff member by ID' }) 
  @ApiResponse({ status: 200, description: 'Staff member retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Staff member not found' })
  findOne(@Param('id') id: string) {
    return this.staffService.findOne(id);
  }

  // NEW: Update Staff (e.g., Reset Password)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a staff member' })
  @ApiResponse({ status: 200, description: 'Staff member updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.staffService.update(id, updateEmployeeDto);
  }

  // NEW: Delete Staff (Fire/Remove)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a staff member' })
  @ApiResponse({ status: 200, description: 'Staff member deleted successfully' })
  remove(@Param('id') id: string) {
    return this.staffService.remove(id);
  }
}