import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import 'dotenv/config';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.use((req: { header: (arg0: string, arg1: string) => void; }, res: { header: (arg0: string, arg1: string) => void; }, next: () => void) => {
    req.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Origin', '*');

    req.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Methods', '*');

    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
    next();
  });
  app.useGlobalPipes(new ValidationPipe());
  app.useStaticAssets(join(__dirname, '/temp'), { prefix: '/temp' });

  const config = new DocumentBuilder()
    .setTitle('TODO App APIs')
    .setDescription('API Documentation for TODO App')
    .setVersion('1.0')
    .addBearerAuth({ in: 'header', type: 'http', scheme: 'bearer', bearerFormat: 'Bearer' }, 'Authorization')
    .addTag('APIs')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(process.env.PORT);
}

bootstrap();
