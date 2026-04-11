import { Address, toNano } from '@ton/core';
import { NftCollection } from '../build/NftCollection/tact_NftCollection';
import { NetworkProvider } from '@ton/blueprint';
import { getNetworkEnv, getRequiredNetworkEnv } from './networkEnv';

export async function run(provider: NetworkProvider) {
    const collectionAddress = Address.parse(getRequiredNetworkEnv(provider, 'COLLECTION_ADDRESS'));
    const numerator = BigInt(getRequiredNetworkEnv(provider, 'NEW_ROYALTY_NUMERATOR'));
    const denominator = BigInt(getRequiredNetworkEnv(provider, 'NEW_ROYALTY_DENOMINATOR'));
    const nftCollection = provider.open(NftCollection.fromAddress(collectionAddress));
    const currentRoyalty = await nftCollection.getRoyaltyParams();
    const destination = Address.parse(
        getNetworkEnv(provider, 'NEW_ROYALTY_DESTINATION') ?? currentRoyalty.destination.toString(),
    );
    const sendValue = toNano(getNetworkEnv(provider, 'UPDATE_ROYALTY_VALUE') ?? '0.05');

    if (denominator <= 0n) {
        throw new Error('NEW_ROYALTY_DENOMINATOR must be greater than 0');
    }

    if (numerator > denominator) {
        throw new Error('NEW_ROYALTY_NUMERATOR must be less than or equal to NEW_ROYALTY_DENOMINATOR');
    }

    provider.ui().write(`Network: ${provider.network()}`);
    provider.ui().write(`Collection: ${collectionAddress.toString()}`);
    provider.ui().write(
        `Current royalty: ${currentRoyalty.numerator.toString()}/${currentRoyalty.denominator.toString()} -> ${currentRoyalty.destination.toString()}`,
    );
    provider.ui().write(
        `New royalty: ${numerator.toString()}/${denominator.toString()} -> ${destination.toString()}`,
    );

    await nftCollection.send(
        provider.sender(),
        { value: sendValue },
        {
            $$type: 'UpdateRoyalty',
            numerator,
            denominator,
            destination,
        },
    );

    provider.ui().write('Royalty update transaction sent.');
}
