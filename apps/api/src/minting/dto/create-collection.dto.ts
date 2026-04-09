import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

class CollectionMetadataDto {
  @IsString()
  @Length(1, 120)
  name!: string;

  @IsString()
  @Length(1, 1000)
  description!: string;

  @IsOptional()
  @IsUrl()
  image?: string;

  @IsOptional()
  @IsUrl()
  external_link?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @IsUrl({}, { each: true })
  social_links?: string[];

  @IsOptional()
  @IsUrl()
  cover_image?: string;
}

export class CreateCollectionDto {
  @IsString()
  @Length(1, 100)
  requestId!: string;

  @IsString()
  @Length(10, 128)
  ownerAddress!: string;

  @IsNumber()
  @Min(0)
  @Max(49)
  royaltyPercent!: number;

  @IsString()
  @Length(10, 128)
  royaltyAddress!: string;

  @ValidateNested()
  @Type(() => CollectionMetadataDto)
  metadata!: CollectionMetadataDto;
}

