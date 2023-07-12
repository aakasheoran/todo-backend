import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length, IsEmail, Matches } from 'class-validator';
import { PASSWORD_REGEX } from 'src/configs/constants';
import { LogInUserDTO } from './login-user.dto';

export class ChangePasswordDTO extends LogInUserDTO {
  @ApiProperty({ description: 'New Password of the user', example: 'Abcd@123', required: true })
  @IsString()
  @Length(8, 20)
  @Matches(PASSWORD_REGEX, { message: 'New Password must contain at least 1 uppercase, 1 lowercase, 1 number & 1 special character' })
  newPassword: string;

  @ApiProperty({ description: 'Confirm the New Password of user', example: 'Abcd@123', required: true })
  @IsString()
  @Length(8, 20)
  @Matches(PASSWORD_REGEX, { message: 'Confirm New Password must contain at least 1 uppercase, 1 lowercase, 1 number & 1 special character' })
  confirmNewPassword: string;
}