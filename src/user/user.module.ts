import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserSchema } from './entity/create-user.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), AuthModule],
  controllers: [UserController],
  providers: [UserService, JwtService],
})
export class UserModule {}
