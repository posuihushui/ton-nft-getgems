import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { validateEnvironment } from './config/env.validation';
import { GetgemsModule } from './getgems/getgems.module';
import { HealthModule } from './health/health.module';
import { MintingModule } from './minting/minting.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['apps/api/.env', '.env'],
      validate: validateEnvironment,
    }),
    HealthModule,
    GetgemsModule,
    MintingModule,
  ],
})
export class AppModule {}

