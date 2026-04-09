import { IsIn, IsOptional } from 'class-validator';

import { GETGEMS_NETWORKS, type GetgemsNetwork } from '../../getgems/getgems.network';

export class NetworkQueryDto {
  @IsOptional()
  @IsIn(GETGEMS_NETWORKS)
  network?: GetgemsNetwork;
}

