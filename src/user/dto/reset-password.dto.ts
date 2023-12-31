import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, Matches, MinLength } from 'class-validator';
import { ForgotPasswordDTO } from './forgot-password.dto';
import { PASSWORD_REGEX } from 'src/configs/constants';

export class ResetPasswordDTO extends ForgotPasswordDTO {
  @ApiProperty({ description: 'New Password of the user', example: 'Abcd@123', required: true })
  @IsString()
  @Length(8, 20)
  @Matches(PASSWORD_REGEX, { message: 'New Password must contain at least 1 uppercase, 1 lowercase, 1 number & 1 special character' })
  newPassword: string;

  @ApiProperty({ description: 'Confirm New Password of the user', example: 'Abcd@123', required: true })
  @IsString()
  @Length(8, 20)
  @Matches(PASSWORD_REGEX, { message: 'Confirm New Password must contain at least 1 uppercase, 1 lowercase, 1 number & 1 special character' })
  confirmNewPassword: string;
}