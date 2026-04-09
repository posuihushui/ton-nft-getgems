import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  MaxLength,
  ValidateNested,
} from 'class-validator';

import { NftAttributeDto, NftButtonDto } from './create-mint.dto';

class V2BatchMintItemDto {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  requestId?: string;

  @IsString()
  @Length(10, 128)
  ownerAddress!: string;

  @IsString()
  @Length(1, 120)
  name!: string;

  @IsString()
  @MaxLength(1000)
  description!: string;

  @IsUrl()
  image!: string;

  @IsOptional()
  @IsUrl()
  lottie?: string;

  @IsOptional()
  @IsUrl()
  content_url?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NftAttributeDto)
  attributes?: NftAttributeDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NftButtonDto)
  buttons?: NftButtonDto[];

  @IsOptional()
  @IsInt()
  index?: number;
}

export class CreateBatchMintV2Dto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  @ValidateNested({ each: true })
  @Type(() => V2BatchMintItemDto)
  items!: V2BatchMintItemDto[];
}
