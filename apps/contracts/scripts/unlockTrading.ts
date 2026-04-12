import { Address, toNano } from '@ton/core';
import { NftCollection } from '../build/NftCollection/tact_NftCollection';
import { NetworkProvider, sleep } from '@ton/blueprint';
import { getRequiredNetworkEnv } from './networkEnv';

export async function run(provider: NetworkProvider) {
    const collectionAddress = Address.parse(getRequiredNetworkEnv(provider, 'COLLECTION_ADDRESS'));
    const nftCollection = provider.open(NftCollection.fromAddress(collectionAddress));

    const collectionData = await nftCollection.getGetCollectionData();
    const totalItems = collectionData.next_item_index;
    const unlockCost = totalItems * toNano('0.02') + toNano('0.05');

    console.log('1. Unlocking future mints in Collection...',collectionAddress.toString());
    await nftCollection.send(
        provider.sender(),
        { value: toNano('0.05') },
        { $$type: 'SetMintLock', locked: false }
    );

    await sleep(5000);

    console.log(`2. Broadcasting unlock to items 0-${collectionData.next_item_index}...`);
    await nftCollection.send(
        provider.sender(),
        { value: unlockCost },
        { 
            $$type: 'BroadcastLock', 
            locked: false, 
            from_index: 0n, 
            to_index: collectionData.next_item_index
        }
    );

    console.log('Unlock broadcast sent!');
}
