// @ts-nocheck
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { EmployeeRole } from '../entities/employee.entity';

export class UpdateEmployeeDto {
  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEnum(EmployeeRole)
  role?: EmployeeRole;

  @IsOptional()
  @IsString()
  @MinLength(4, { message: 'PIN must be at least 4 digits' })
  pin_code?: string;

  @IsOptional()
  active?: boolean;
}