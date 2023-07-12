import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from 'src/user/dto/create-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('User Controller')
@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {}

  @ApiOperation({ summary: 'Register a new user' })
  @Post('signup')
  async signUp(@Body() signUpDto: CreateUserDTO): Promise<{ token: string }> {
    return await this.authService.signUpUser(signUpDto);
  }

  @ApiOperation({ summary: 'Login a user' })
  @Post('login')
  async login(@Body() logInDto: { email: string; password: string }): Promise<{ token: string }> {
    return await this.authService.loginUser(logInDto);
  }
}
