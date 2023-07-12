import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';
import { ForgotPasswordDTO } from './forgot-password.dto';

export class checkOtpDTO extends ForgotPasswordDTO {
  @ApiProperty({ description: 'OTP - One Time Password', example: '123456', required: true })
  @IsString()
  @MinLength(6)
  otp: string;
}