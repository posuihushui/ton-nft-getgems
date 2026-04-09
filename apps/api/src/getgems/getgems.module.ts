import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { GetgemsService } from './getgems.service';

@Module({
  imports: [HttpModule],
  providers: [GetgemsService],
  exports: [GetgemsService],
})
export class GetgemsModule {}

