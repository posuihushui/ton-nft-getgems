import { Address, toNano, beginCell } from '@ton/core';
import { NftCollection } from '../build/NftCollection/tact_NftCollection';
import { NetworkProvider } from '@ton/blueprint';
import { getNetworkEnv, getRequiredNetworkEnv } from './networkEnv';

function buildOffchainContent(url: string) {
    return beginCell()
        .storeUint(0, 8)
        .storeStringTail(url)
        .endCell();
}

function buildCommonContent(urlPrefix: string) {
    return beginCell()
        .storeStringTail(urlPrefix)
        .endCell();
}

export async function run(provider: NetworkProvider) {
    const owner = provider.sender().address!!;
    const collectionContentUrl = getRequiredNetworkEnv(provider, 'COLLECTION_CONTENT_URL');
    const commonContentUrl = getRequiredNetworkEnv(provider, 'COMMON_CONTENT_URL');
    const royaltyNumerator = BigInt(getNetworkEnv(provider, 'ROYALTY_NUMERATOR') ?? '0');
    const royaltyDenominator = BigInt(getNetworkEnv(provider, 'ROYALTY_DENOMINATOR') ?? '1');
    const royaltyDestination = Address.parse(getNetworkEnv(provider, 'ROYALTY_DESTINATION') ?? owner.toString());
    const deployValue = toNano(getNetworkEnv(provider, 'DEPLOY_VALUE') ?? '0.05');

    const collectionContent = buildOffchainContent(collectionContentUrl);
    const commonContent = buildCommonContent(commonContentUrl);

    const nftCollection = provider.open(
        await NftCollection.fromInit(
            owner,
            collectionContent,
            commonContent,
            royaltyNumerator,
            royaltyDenominator,
            royaltyDestination,
        )
    );

    provider.ui().write(`Network: ${provider.network()}`);
    provider.ui().write(`Owner: ${owner.toString()}`);
    provider.ui().write(`Collection metadata: ${collectionContentUrl}`);
    provider.ui().write(`Common item metadata prefix: ${commonContentUrl}`);
    provider.ui().write(
        `Royalty: ${royaltyNumerator.toString()}/${royaltyDenominator.toString()} -> ${royaltyDestination.toString()}`,
    );
    provider.ui().write(`Predicted collection address: ${nftCollection.address.toString()}`);

    await nftCollection.send(
        provider.sender(),
        {
            value: deployValue,
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(nftCollection.address);

    console.log('Collection deployed at:', nftCollection.address.toString());
}
