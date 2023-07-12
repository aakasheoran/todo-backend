import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length, IsEmail } from 'class-validator';

export class ForgotPasswordDTO {
  @ApiProperty({ description: 'Email of the user - Primary Key', example: 'test@test.com', required: true })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Prop({ required: true })
  email: string;
}