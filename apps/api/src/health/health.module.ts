import { Module } from '@nestjs/common';

import { GetgemsModule } from '../getgems/getgems.module';
import { HealthController } from './health.controller';

@Module({
  imports: [GetgemsModule],
  controllers: [HealthController],
})
export class HealthModule {}
