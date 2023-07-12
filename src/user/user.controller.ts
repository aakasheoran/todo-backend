import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { RolesGuard } from 'src/roles/roles.guard';
import { UserService } from './user.service';
import { User } from './entity/create-user.entity';

@ApiTags('User Controller')
@Controller('api/v1/user')
@UseGuards(AuthGuard())
// @UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all registered users' })
  async getAllUsers(): Promise<User[]> {
    return await this.userService.getAllUsers();
  }

  @Get('profile')
  // @Roles('admin') // Replace 'admin' with the required role to access this route
  getProfile() {
    // This route is protected by the JwtAuthGuard and RolesGuard
    // Only users with the 'admin' role can access this route
    // Implement your profile retrieval logic here
    // For simplicity, we'll just return a success message
    return { message: 'Authorized to access profile' };
  }
}
