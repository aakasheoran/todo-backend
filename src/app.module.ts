import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI),
    RedisModule.forRoot({
      config: {
        url: process.env.REDIS_URL
      },
    }),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService]
})

export class AppModule {
  constructor() { }
}
