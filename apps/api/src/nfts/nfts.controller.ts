import { Controller, Get, Param, Query } from '@nestjs/common';

import { NetworkQueryDto } from '../minting/dto/network-query.dto';
import { NftsService } from './nfts.service';

class NftListQueryDto extends NetworkQueryDto {
  cursor?: string;
  limit?: number;
}

@Controller('nfts')
export class NftsController {
  constructor(private readonly nftsService: NftsService) {}

  /** GET /api/nfts/collection/:collectionAddress — List all NFTs in a collection */
  @Get('collection/:collectionAddress')
  getCollectionNfts(
    @Param('collectionAddress') collectionAddress: string,
    @Query() query: NftListQueryDto,
  ) {
    return this.nftsService.getCollectionNfts(
      collectionAddress,
      query.cursor,
      query.limit,
      query.network,
    );
  }

  /** GET /api/nfts/item/:nftAddress — Get a single NFT by address */
  @Get('item/:nftAddress')
  getNftItem(
    @Param('nftAddress') nftAddress: string,
    @Query() query: NetworkQueryDto,
  ) {
    return this.nftsService.getNftItem(nftAddress, query.network);
  }
}
