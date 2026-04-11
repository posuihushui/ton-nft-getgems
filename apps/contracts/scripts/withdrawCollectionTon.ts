import { Address, toNano } from '@ton/core';
import { NftCollection } from '../build/NftCollection/tact_NftCollection';
import { NetworkProvider } from '@ton/blueprint';
import { getNetworkEnv, getRequiredNetworkEnv } from './networkEnv';

export async function run(provider: NetworkProvider) {
    const collectionAddress = Address.parse(getRequiredNetworkEnv(provider, 'COLLECTION_ADDRESS'));
    const withdrawAmount = toNano(getRequiredNetworkEnv(provider, 'WITHDRAW_AMOUNT'));
    const nftCollection = provider.open(NftCollection.fromAddress(collectionAddress));
    const collectionData = await nftCollection.getGetCollectionData();
    const destination = Address.parse(
        getNetworkEnv(provider, 'WITHDRAW_DESTINATION') ?? collectionData.owner_address.toString(),
    );
    const sendValue = toNano(getNetworkEnv(provider, 'WITHDRAW_VALUE') ?? '0.05');

    if (withdrawAmount <= 0n) {
        throw new Error('WITHDRAW_AMOUNT must be greater than 0');
    }

    provider.ui().write(`Network: ${provider.network()}`);
    provider.ui().write(`Collection: ${collectionAddress.toString()}`);
    provider.ui().write(`Collection owner: ${collectionData.owner_address.toString()}`);
    provider.ui().write(`Withdraw amount: ${withdrawAmount.toString()} nanotons`);
    provider.ui().write(`Destination: ${destination.toString()}`);

    await nftCollection.send(
        provider.sender(),
        { value: sendValue },
        {
            $$type: 'WithdrawTon',
            amount: withdrawAmount,
            destination,
        },
    );

    provider.ui().write('Withdraw transaction sent.');
}
