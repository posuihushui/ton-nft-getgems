import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';

import { NftMintPayloadDto } from './create-mint.dto';

export class CreateBatchMintDto {
  @IsString()
  @Length(1, 100)
  requestId!: string;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(100)
  @ValidateNested({ each: true })
  @Type(() => NftMintPayloadDto)
  items!: NftMintPayloadDto[];
}
