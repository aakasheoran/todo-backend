import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { User, UserDocument } from './entity/create-user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDTO } from './dto/create-user.dto';
import { compareSync, hashSync } from 'bcrypt';
import { SALT_ROUND } from 'src/configs/constants';
import { sendMail } from 'src/utils/sendEmail';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService
  ) { }
  private readonly logger = new Logger(UserService.name);

  async getAllUsers(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async validateUser(email: string, password: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.userModel.findOne({ email });
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async generateJwtToken(user: Omit<User, 'password'>): Promise<string> {
    return this.jwtService.signAsync({ loginId: user.email });
  }

  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email })
  }

  async createUser(user: CreateUserDTO): Promise<User> {
    const userExists = await this.findByEmail(user.email);
    if (userExists) {
      throw new ConflictException('User already exists with that email');
    }
    user.password = hashSync(user.password, SALT_ROUND);
    const createdUser = new this.userModel(user);
    const newUser = await createdUser.save();
    this.logger.log(`User created successfully with id: ${newUser._id}`);

    await sendMail({
      to: user.email,
      subject: 'Welcome to your new account',
      html: `
        <h1>Welcome to your new account</h1>
        <p>Hi ${user.name},</p>
        <p>Thank you for signing up for an account with us. We are excited to have you on board.</p>
        <p>You can login with your email: ${user.email}</p>
        <p>Regards,</p>
        <p>Team</p>
      `
    });

    // const token = await this.generateJwtToken(newUser);
    // return { token };

    return { ...newUser.toJSON(), password: undefined };
  }
}
