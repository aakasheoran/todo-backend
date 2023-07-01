import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigService, ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthMiddleware } from './auth/auth.middleware';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    RedisModule.forRoot({
      config: {
        url: process.env.REDIS_URL
      },
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        console.log(config.get<string>('JWT_SECRET'))
        console.log(config.get<string | number>('JWT_EXPIRY'))
        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: config.get<string | number>('JWT_EXPIRY'),
          },
        }
      }
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtService],
  exports: [JwtService]
})

export class AppModule {
  constructor() { }

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'api/v1/user', method: RequestMethod.ALL },
        // { path: 'api/v1/user/signup', method: RequestMethod.POST }
      )
      .forRoutes('*')
  }
}
