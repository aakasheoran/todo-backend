import { Prop } from '@nestjs/mongoose';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length, IsEmail, IsEnum, IsDateString, IsOptional } from 'class-validator';
import { Gender, Role } from 'src/configs/enums';

export class CreateUserDTO {
  @ApiProperty({ description: 'Full Name of the user', example: 'John Doe', required: true })
  @IsString()
  @IsNotEmpty()
  @Prop({ required: true })
  name: string;

  @ApiProperty({ description: 'Gender of the user', example: Gender.MALE, enum: Gender, required: true })
  @IsEnum(Gender)
  @Prop({ enum: [Gender.MALE, Gender.FEMALE], required: true })
  gender: Gender;

  @ApiProperty({ description: 'Date of birth of the user', example: '1990-01-01', required: true })
  @IsDateString()
  @Prop({ required: true })
  dob: Date;

  @ApiProperty({ description: 'Full Address of the user', example: 'H No, Street, City, State - Zipcode', required: true })
  @IsString()
  @IsNotEmpty()
  @Prop({ required: true })
  address: string;

  @ApiProperty({ description: 'Mobile number of the user', example: '1234567890', required: true })
  @IsString()
  @IsNotEmpty()
  @Length(10, 10)
  @Prop({ required: true })
  mobile: string;

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

  @ApiProperty({ description: 'Role of the user', example: Role.USER, enum: Role, required: false, default: Role.USER })
  @IsOptional()
  @IsEnum(Role)
  @Prop({ enum: [Role.ADMIN, Role.USER], default: Role.USER, required: true })
  role: Role;
}