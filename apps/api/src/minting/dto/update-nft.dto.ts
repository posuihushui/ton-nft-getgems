import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, IsUrl, Length, MaxLength, ValidateNested } from 'class-validator';

import { NftAttributeDto, NftButtonDto } from './create-mint.dto';

class UpdatePayloadDto {
  @IsOptional()
  @IsString()
  @Length(1, 120)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsUrl()
  image?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NftAttributeDto)
  attributes?: NftAttributeDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NftAttributeDto)
  upsertAttributes?: NftAttributeDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NftButtonDto)
  buttons?: NftButtonDto[];
}

export class UpdateNftDto {
  @ValidateNested()
  @Type(() => UpdatePayloadDto)
  update!: UpdatePayloadDto;
}

