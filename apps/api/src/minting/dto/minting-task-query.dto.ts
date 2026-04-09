import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

import { GETGEMS_NETWORKS, type GetgemsNetwork } from '../../getgems/getgems.network';

export class MintingTaskQueryDto {
  @IsOptional()
  @IsString()
  after?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  reverse?: boolean;

  @IsOptional()
  @IsIn(GETGEMS_NETWORKS)
  network?: GetgemsNetwork;
}

