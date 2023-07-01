import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI),
    RedisModule.forRoot({
      config: {
        host: 'localhost',
        port: 6379
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {
  constructor() {}
}
