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

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function isTransientNetworkError(error: unknown): boolean {
    if (!(error instanceof Error)) {
        return false;
    }

    const message = error.message.toLowerCase();
    const code = 'code' in error ? String((error as { code?: string }).code ?? '').toUpperCase() : '';

    return (
        code === 'ECONNRESET' ||
        code === 'ETIMEDOUT' ||
        code === 'ERR_BAD_RESPONSE' ||
        message.includes('socket hang up') ||
        message.includes('lite_server_notready') ||
        message.includes('status code 500')
    );
}

async function retryTransient<T>(
    action: () => Promise<T>,
    ui: NetworkProvider['ui'] extends () => infer U ? U : never,
    label: string,
    attempts: number,
    delayMs: number,
): Promise<T> {
    let lastError: unknown;

    for (let attempt = 1; attempt <= attempts; attempt += 1) {
        try {
            return await action();
        } catch (error) {
            lastError = error;

            if (!isTransientNetworkError(error) || attempt === attempts) {
                throw error;
            }

            ui.write(`${label} failed on attempt ${attempt}/${attempts}, retrying in ${delayMs}ms...`);
            await sleep(delayMs);
        }
    }

    throw lastError;
}

export async function run(provider: NetworkProvider) {
    const owner = provider.sender().address!!;
    const collectionContentUrl = getRequiredNetworkEnv(provider, 'COLLECTION_CONTENT_URL');
    const commonContentUrl = getRequiredNetworkEnv(provider, 'COMMON_CONTENT_URL');
    const royaltyNumerator = BigInt(getNetworkEnv(provider, 'ROYALTY_NUMERATOR') ?? '0');
    const royaltyDenominator = BigInt(getNetworkEnv(provider, 'ROYALTY_DENOMINATOR') ?? '1');
    const royaltyDestination = Address.parse(getNetworkEnv(provider, 'ROYALTY_DESTINATION') ?? owner.toString());
    const deployValue = toNano(getNetworkEnv(provider, 'DEPLOY_VALUE') ?? '0.05');
    const retryAttempts = Number(getNetworkEnv(provider, 'DEPLOY_RETRY_ATTEMPTS') ?? '4');
    const retryDelayMs = Number(getNetworkEnv(provider, 'DEPLOY_RETRY_DELAY_MS') ?? '3000');

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
    provider.ui().write(`Deploy retries: ${retryAttempts} attempts, ${retryDelayMs}ms delay`);

    await retryTransient(
        () =>
            nftCollection.send(
                provider.sender(),
                {
                    value: deployValue,
                },
                {
                    $$type: 'Deploy',
                    queryId: 0n,
                }
            ),
        provider.ui(),
        'Deploy send',
        retryAttempts,
        retryDelayMs,
    );

    await retryTransient(
        () => provider.waitForDeploy(nftCollection.address),
        provider.ui(),
        'Deploy confirmation',
        retryAttempts,
        retryDelayMs,
    );

    console.log('Collection deployed at:', nftCollection.address.toString());
}
