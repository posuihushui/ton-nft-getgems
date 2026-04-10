import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { NftsController } from './nfts.controller';
import { NftsService } from './nfts.service';

@Module({
  imports: [HttpModule],
  controllers: [NftsController],
  providers: [NftsService],
})
export class NftsModule {}
