import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { CreateUserDTO } from 'src/user/dto/create-user.dto';
import { LogInUserDTO } from 'src/user/dto/login-user.dto';
import { ForgotPasswordDTO } from 'src/user/dto/forgot-password.dto';
import { checkOtpDTO } from 'src/user/dto/otp-check.dto';
import { ResetPasswordDTO } from 'src/user/dto/reset-password.dto';
import { ChangePasswordDTO } from 'src/user/dto/change-password.dto';

@ApiTags('Auth Controller')
@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) { }

  @ApiOperation({ summary: 'Register a new user' })
  @Post('signup')
  async signUp(@Body() signUpDto: CreateUserDTO): Promise<{ token: string }> {
    return await this.authService.signUpUser(signUpDto);
  }

  @ApiOperation({ summary: 'Login a user' })
  @Post('login')
  async login(@Body() logInDto: LogInUserDTO): Promise<{ token: string }> {
    return await this.authService.loginUser(logInDto);
  }

  @ApiOperation({ summary: 'Change old password to a new password' })
  @Post('change-password')
  async changePassword(@Body() changePasswordDTO: ChangePasswordDTO): Promise<{ message: string }> {
    return await this.authService.changePassword(changePasswordDTO);
  }

  @ApiOperation({ summary: 'Forgot password, send otp' })
  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDTO): Promise<{ message: string }> {
    return await this.authService.forgotPassword(forgotPasswordDto);
  }

  @ApiOperation({ summary: 'Validate the OTP' })
  @Post('check-otp')
  async checkOTP(@Body() checkOtpDto: checkOtpDTO): Promise<{ message: string }> {
    return await this.authService.checkOTP(checkOtpDto);
  }

  @ApiOperation({ summary: 'Reset password' })
  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDTO): Promise<{ message: string }> {
    return await this.authService.resetPassword(resetPasswordDto);
  }
}
