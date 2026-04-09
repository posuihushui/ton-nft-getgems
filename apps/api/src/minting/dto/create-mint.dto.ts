import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  MaxLength,
  ValidateNested,
} from 'class-validator';

class NftAttributeDto {
  @IsString()
  @Length(1, 80)
  trait_type!: string;

  @IsString()
  @Length(1, 120)
  value!: string;
}

class NftButtonDto {
  @IsString()
  @Length(1, 48)
  label!: string;

  @IsUrl()
  uri!: string;
}

class NftMintPayloadDto {
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

export class CreateMintDto extends NftMintPayloadDto {
  @IsString()
  @Length(1, 100)
  requestId!: string;
}

export { NftAttributeDto, NftButtonDto, NftMintPayloadDto };
