import { Controller, Get, Query, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AppEnvironment } from '../config/env.validation';
import { GetgemsService } from '../getgems/getgems.service';
import { NetworkQueryDto } from '../minting/dto/network-query.dto';

@Controller('health')
export class HealthController {
  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService<AppEnvironment, true>,
    @Inject(GetgemsService) private readonly getgemsService: GetgemsService,
  ) { }

  @Get()
  getHealth(@Query() query: NetworkQueryDto) {
    const networkSummary = this.getgemsService.getNetworkSummary(query.network);

    return {
      service: 'ton-getgems-api',
      status: 'ok',
      now: new Date().toISOString(),
      environment: this.configService.get('NODE_ENV', { infer: true }),
      defaultNetwork: networkSummary.defaultNetwork,
      selectedNetwork: networkSummary.selectedNetwork,
      collectionAddress: networkSummary.collectionAddress,
      getgemsBaseUrl: networkSummary.getgemsBaseUrl,
      getgemsConfigured: networkSummary.networkConfig[networkSummary.selectedNetwork],
      networkConfig: networkSummary.networkConfig,
    };
  }
}
