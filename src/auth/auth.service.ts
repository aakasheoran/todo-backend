import { BadRequestException, ConflictException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDTO } from 'src/user/dto/create-user.dto';
import { User, UserDocument } from 'src/user/entity/create-user.entity';
import * as bcrypt from 'bcrypt';
import { SALT_ROUND } from 'src/configs/constants';
import { sendMail } from 'src/utils/sendEmail';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService
  ) { }
  private readonly logger = new Logger(AuthService.name);

  async signUpUser(signUpDto: CreateUserDTO): Promise<{ token: string }> {
    const { name, email, password, ...rest } = signUpDto;
    const userExists = await this.userModel.findOne({ email: email });
    if (userExists) {
      throw new ConflictException('User already exists with that email');
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
        <h1>Welcome to your new account</h1>
        <p>Hi ${name},</p>
        <p>Thank you for signing up for an account with us. We are excited to have you on board.</p>
        <p>You can login with your email: ${email}</p>
        <p>Regards,</p>
        <p>Team ToDo</p>
      `
    });

    return { token };
  }

  async loginUser(logInDto: { email: string; password: string }): Promise<{ token: string }> {
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
}
