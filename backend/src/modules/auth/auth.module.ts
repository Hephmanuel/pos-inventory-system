import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { StaffModule } from '../staff/staff.module';

@Module({
  imports: [StaffModule], 
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}