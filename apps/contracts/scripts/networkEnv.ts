import { NetworkProvider } from '@ton/blueprint';

export function getNetworkEnv(provider: NetworkProvider, key: string): string | undefined {
    const network = provider.network();
    const prefixes = network === 'mainnet'
        ? ['MAINNET_', '']
        : network === 'testnet'
            ? ['TESTNET_', '']
            : [''];

    for (const prefix of prefixes) {
        const value = process.env[`${prefix}${key}`]?.trim();
        if (value) {
            return value;
        }
    }

    return undefined;
}

export function getRequiredNetworkEnv(provider: NetworkProvider, key: string): string {
    const value = getNetworkEnv(provider, key);
    if (!value) {
        throw new Error(
            `Missing ${key} for ${provider.network()}. Set ${provider.network().toUpperCase()}_${key} or ${key} in apps/contracts/.env.`,
        );
    }
    return value;
}
