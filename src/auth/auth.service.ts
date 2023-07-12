import { BadRequestException, ConflictException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDTO } from 'src/user/dto/create-user.dto';
import { User, UserDocument } from 'src/user/entity/create-user.entity';
import * as bcrypt from 'bcrypt';
import { DEFAULT_OTP_LENGTH, NUMBERS, REDIS_EXPIRY_KEY, REDIS_EXPIRY_TIME, SALT_ROUND } from 'src/configs/constants';
import { sendMail } from 'src/utils/sendEmail';
import { JwtService } from '@nestjs/jwt';
import { ForgotPasswordDTO } from 'src/user/dto/forgot-password.dto';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { checkOtpDTO } from 'src/user/dto/otp-check.dto';
import { ResetPasswordDTO } from 'src/user/dto/reset-password.dto';
import { LogInUserDTO } from 'src/user/dto/login-user.dto';
import { ChangePasswordDTO } from 'src/user/dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
    @InjectRedis() private readonly redis: Redis
  ) { }
  private readonly logger = new Logger(AuthService.name);

  getOtp(size: number = 6): string {
    const min = Math.pow(10, size - 1);
    const max = Math.pow(10, size) - 1;
    const otp = Math.floor(min + Math.random() * (max - min + 1)).toString();
    return otp;
  }

  async signUpUser(signUpDto: CreateUserDTO): Promise<{ token: string }> {
    const { name, email, password, confirmPassword, ...rest } = signUpDto;
    const userExists = await this.userModel.findOne({ email: email });
    if (userExists) {
      throw new ConflictException('User already exists with that email');
    }
    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }
    const hashedPassword = bcrypt.hashSync(password, SALT_ROUND);
    const newUser = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
      ...rest,
    });
    const token = this.jwtService.sign({ id: newUser._id, role: newUser.role, name, email });
    this.logger.log(`User created successfully with id: ${newUser._id}`);

    await sendMail({
      to: email,
      subject: 'Welcome to your new account',
      html: `
        <p>Hi ${name},</p>
        <p>Thank you for signing up for an account with us. We are excited to have you on board.</p>
        <p>You can login with your email: ${email}</p>
        <p>Regards,</p>
        <p>Team ToDo</p>
      `
    });

    return { token };
  }

  async loginUser(logInDto: LogInUserDTO): Promise<{ token: string }> {
    const { email, password } = logInDto;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new BadRequestException('User does not exist');
    }
    if (!bcrypt.compareSync(password, user.password)) {
      throw new BadRequestException('Invalid credentials');
    }

    const token = this.jwtService.sign({ id: user._id, role: user.role, name: user.name, email });
    return { token };
  }

  async changePassword(changePasswordDto: ChangePasswordDTO): Promise<{ message: string }> {
    const { email, password, newPassword, confirmNewPassword } = changePasswordDto;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new BadRequestException('User does not exist');
    }
    if (!bcrypt.compareSync(password, user.password)) {
      throw new BadRequestException('Invalid credentials');
    }
    if (newPassword !== confirmNewPassword) {
      throw new BadRequestException('New password and confirm new password does not match');
    }

    const hashedPassword = bcrypt.hashSync(newPassword, SALT_ROUND);
    await this.userModel.findOneAndUpdate({ email }, { $set: { password: hashedPassword } }, { new: true });

    await sendMail({
      to: email,
      subject: 'Password Changed Successfully',
      html: `
        <p>Hi ${user.name},</p>
        <p>Your password has been changed successfully.</p>
        <p>You can login now with your newly updated password.</p>
        <p>Regards,</p>
        <p>Team ToDo</p>
      `
    });

    return { message: 'Password changed successfully' };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDTO): Promise<{ message: string }> {
    const { email } = forgotPasswordDto;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new BadRequestException('User does not exist');
    }

    const otp = this.getOtp(DEFAULT_OTP_LENGTH);
    const key = `user:${user._id}:forgot-password`;
    await this.redis.set(key, otp, REDIS_EXPIRY_KEY, REDIS_EXPIRY_TIME);

    await sendMail({
      to: email,
      subject: 'OTP to reset password',
      html: `
        <p>Hi ${user.name},</p>
        <p>Your otp to reset the password is: <strong>${otp}</strong></p>
        <p>This will expire in 5 minutes.</p>
        <p>Regards,</p>
        <p>Team ToDo</p>
      `
    });

    return { message: 'Email with OTP sent successfully' };
  }

  async checkOTP(checkOtpDto: checkOtpDTO): Promise<{ message: string }> {
    const { email, otp } = checkOtpDto;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new BadRequestException('User does not exist');
    }

    const key = `user:${user._id}:forgot-password`;
    const otpFromRedis = await this.redis.get(key);
    if (!otpFromRedis) {
      throw new BadRequestException('OTP is expired');
    }
    if (otpFromRedis !== otp) {
      throw new BadRequestException('Invalid OTP');
    }

    await this.redis.del(key);
    return { message: 'OTP is validated successfully' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDTO): Promise<{ message: string }> {
    const { email, newPassword, confirmNewPassword } = resetPasswordDto;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new BadRequestException('User does not exist');
    }
    if (newPassword !== confirmNewPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const hashedPassword = bcrypt.hashSync(newPassword, SALT_ROUND);
    await this.userModel.findOneAndUpdate({ email }, { $set: { password: hashedPassword } }, { new: true });

    await sendMail({
      to: email,
      subject: 'Password Reset Successfully',
      html: `
        <p>Hi ${user.name},</p>
        <p>Your password has been reset successfully.</p>
        <p>You can login now with your new password.</p>
        <p>Regards,</p>
        <p>Team ToDo</p>
      `
    });

    return { message: 'Password reset successfully' };
  }
}
