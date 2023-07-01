import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose'

import { CreateUserDTO } from "../dto/create-user.dto";
import { Transform } from 'class-transformer';

export type UserDocument = User & Document;

@Schema({ collection: 'user', timestamps: true })
export class User extends CreateUserDTO {
  @Transform(({ value }) => value.toString())
  _id: Types.ObjectId;

  @ApiProperty({ required: false, default: true, type: Boolean })
  @Prop({ required: false, default: true })
  active: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);