import { Injectable } from '@nestjs/common';
import { StaffService } from '../staff/staff.service';

@Injectable()
export class AuthService {
  constructor(private readonly staffService: StaffService) {}
  

}