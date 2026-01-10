// @ts-nocheck
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { StaffService } from '../staff/staff.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly staffService: StaffService) {}

  async login(loginDto: LoginDto) {
    // 1. Find user by Email
    const user = await this.staffService.findByEmail(loginDto.email);

    // 2. Check if user exists
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 3. Check PIN (Secure Bcrypt Compare)
    const isMatch = await bcrypt.compare(loginDto.pin_code, user.pin_code);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 4. Return success
    return {
      message: 'Login successful',
      user: {
        id: user.id,
        full_name: `${user.first_name} ${user.last_name}`,
        role: user.role,
      },
    };
  }
}