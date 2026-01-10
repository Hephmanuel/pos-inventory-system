// @ts-nocheck
import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

// Defines the allowed roles from your DDL 
export enum EmployeeRole {
  CASHIER = 'cashier',
  MANAGER = 'manager',
  ADMIN = 'admin',
}

@Entity('employees')
export class Employee extends BaseEntity {
  @Column()
  first_name!: string; 

  @Column()
  last_name!: string;   

  @Column({ unique: true })
  email!: string;       

  @Column({
    type: 'enum',
    enum: EmployeeRole,
    default: EmployeeRole.CASHIER,
  })
  role!: EmployeeRole;  

  @Column()
  pin_code!: string;    

  @Column({ default: true })
  active!: boolean;     
}