// @ts-nocheck
import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { EmployeeRole } from '../entities/employee.entity';

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  first_name!: string;

  @IsString()
  @IsNotEmpty()
  last_name!: string;

  @IsEmail()
  email!: string;

  @IsEnum(EmployeeRole)
  role!: EmployeeRole;

  @IsString()
  @MinLength(4, { message: 'PIN must be at least 4 digits' })
  pin_code!: string;
}