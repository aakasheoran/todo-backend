import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';
import { InjectRedis } from '@liaoliaots/nestjs-redis';

type User = {
  roles: string[];
  loginId: string;  // email id
  userObjectId: string; // user's object id
}

interface AuthenticatedRequest extends Request {
  user: User;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @InjectRedis() private readonly redis: Redis
  ) {}

  async use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    if (req.path.includes('login')) {
      return next();
    }
    
    const headers = req.headers;

    if (headers.hasOwnProperty('Authorization') || headers.hasOwnProperty('authorization')) {
      const token: string = (headers.Authorization as string) || (headers.authorization as string);

      const tokenValue = await this.redis.get(token.replace('Bearer ', ''));
      if (!tokenValue) {
        throw new UnauthorizedException('Invalid auth token, please login again');
      }

      try {
        const user = JSON.parse(tokenValue);
        console.log('user', user);
        req.user = user;
        next();
      } catch (error) {
        console.error(error);
        console.error('Token exists but value is not a valid JSON');
        throw new UnauthorizedException();
      }
    } else {
      throw new UnauthorizedException();
    }
  }
}
