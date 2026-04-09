import { Module } from '@nestjs/common';

import { GetgemsModule } from '../getgems/getgems.module';
import { MintingController } from './minting.controller';
import { MintingService } from './minting.service';

@Module({
  imports: [GetgemsModule],
  controllers: [MintingController],
  providers: [MintingService],
})
export class MintingModule {}
