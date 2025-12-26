import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { StaffService } from './staff.service';
@Module({
  imports: [TypeOrmModule.forFeature([Employee])],
  controllers: [],
  providers: [StaffService],
  exports: [TypeOrmModule, StaffService], 
})
export class StaffModule {}