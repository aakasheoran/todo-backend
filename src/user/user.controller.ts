import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/roles/roles.guard';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { User } from './entity/create-user.entity';

@ApiTags('User Controller')
@Controller('api/v1/user')
// @UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  async getAllUsers(): Promise<User[]> {
    return await this.userService.getAllUsers();
  }

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  async registerUser(@Body() body: CreateUserDTO): Promise<User> {
    return await this.userService.createUser(body);
  }

  @Post('login')
  async loginUser(@Body() body: { email: string; password: string }) {
    const user = await this.userService.validateUser(body.email, body.password); 
    if (user) {
      const token = await this.userService.generateJwtToken(user);
      return { token: token };
    }
    return { message: 'Invalid credentials' };
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
