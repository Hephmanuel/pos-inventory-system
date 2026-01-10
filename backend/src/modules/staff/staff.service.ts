// @ts-nocheck
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Employee } from './entities/employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto'; // <--- New Import

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {}

  // 1. Create (Already done)
  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    const salt = await bcrypt.genSalt();
    const hashedPin = await bcrypt.hash(createEmployeeDto.pin_code, salt);
    const newEmployee = this.employeeRepository.create({
      ...createEmployeeDto,
      pin_code: hashedPin,
    });
    return await this.employeeRepository.save(newEmployee);
  }

  // 2. Find All
  async findAll(): Promise<Employee[]> {
    return await this.employeeRepository.find();
  }

  // 3. Find One
  async findOne(id: string): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({ where: { id } });
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    return employee;
  }

  // 4. Find by Email
  async findByEmail(email: string): Promise<Employee | null> {
    return await this.employeeRepository.findOne({ where: { email } });
  }

  // 5. UPDATE (New!) - Handles Password Resets too
  async update(id: string, updateEmployeeDto: UpdateEmployeeDto): Promise<Employee> {
    const employee = await this.findOne(id); // Ensure user exists first

    // If they are updating the PIN, we MUST hash it again
    if (updateEmployeeDto.pin_code) {
      const salt = await bcrypt.genSalt();
      updateEmployeeDto.pin_code = await bcrypt.hash(updateEmployeeDto.pin_code, salt);
    }

    // Merge new changes into existing employee
    Object.assign(employee, updateEmployeeDto);

    return await this.employeeRepository.save(employee);
  }

  // 6. DELETE (New!) - Hard Remove
  async remove(id: string): Promise<void> {
    const employee = await this.findOne(id); // Ensure user exists first
    await this.employeeRepository.remove(employee);
  }
}