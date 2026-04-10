import { Address, toNano, beginCell } from '@ton/core';
import { NftCollection } from '../build/NftCollection/tact_NftCollection';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const owner = provider.sender().address!!;
    const content = beginCell()
        .storeUint(0, 8) // off-chain
        .storeStringTail('https://api.getgems.io/nft-collection-metadata.json') // Example
        .endCell();

    const nftCollection = provider.open(
        await NftCollection.fromInit(owner, content)
    );

    await nftCollection.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(nftCollection.address);

    console.log('Collection deployed at:', nftCollection.address.toString());
}
