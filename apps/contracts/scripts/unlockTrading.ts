import { Address, toNano } from '@ton/core';
import { NftCollection } from '../build/NftCollection/tact_NftCollection';
import { NetworkProvider, sleep } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    // Replace with your deployed collection address
    const collectionAddress = Address.parse('EQ...your_address...'); 
    const nftCollection = provider.open(NftCollection.fromAddress(collectionAddress));

    console.log('1. Enabling trading in Collection...');
    await nftCollection.send(
        provider.sender(),
        { value: toNano('0.05') },
        { $$type: 'ToggleTrading', enabled: true }
    );

    await sleep(5000);

    console.log('2. Broadcasting unlock to items 0-50...');
    await nftCollection.send(
        provider.sender(),
        { value: toNano('1.2') }, // ~0.02 TON gas per item * 50
        { 
            $$type: 'BroadcastLock', 
            locked: false, 
            from_index: 0n, 
            to_index: 50n 
        }
    );

    console.log('Unlock broadcast sent!');
}
