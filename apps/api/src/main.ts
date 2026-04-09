import 'reflect-metadata';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';
import { type AppEnvironment } from './config/env.validation';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  const configService = app.get<ConfigService<AppEnvironment, true>>(ConfigService);
  const webOrigin = configService.get('WEB_ORIGIN', { infer: true });
  const port = configService.get('PORT', { infer: true });

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: webOrigin.split(',').map((value) => value.trim()),
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await app.listen(port);
}

void bootstrap();

