import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length, IsEmail, Matches } from 'class-validator';
import { PASSWORD_REGEX } from 'src/configs/constants';

export class LogInUserDTO {
  @ApiProperty({ description: 'Email of the user - Primary Key', example: 'test@test.com', required: true })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Prop({ required: true })
  email: string;

  @ApiProperty({ description: 'Password of the user', example: 'Abcd@123', required: true })
  @IsString()
  @Length(8, 20)
  @Matches(PASSWORD_REGEX, { message: 'Password must contain at least 1 uppercase, 1 lowercase, 1 number & 1 special character' })
  @Prop({ required: true })
  password: string;
}