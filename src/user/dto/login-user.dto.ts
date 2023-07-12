import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length, IsEmail } from 'class-validator';

export class LogInUserDTO {
  @ApiProperty({ description: 'Email of the user - Primary Key', example: 'test@test.com', required: true })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Prop({ required: true, unique: true })
  email: string;

  @ApiProperty({ description: 'Password of the user', example: 'abcd@123', required: true })
  @IsString()
  @IsNotEmpty()
  @Length(8, 20)
  @Prop({ required: true })
  password: string;
}