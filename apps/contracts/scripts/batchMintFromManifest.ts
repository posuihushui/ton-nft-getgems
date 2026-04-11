import fs from 'fs';
import path from 'path';
import { Address, beginCell, toNano } from '@ton/core';
import { NetworkProvider } from '@ton/blueprint';
import { NftCollection } from '../build/NftCollection/tact_NftCollection';
import { getNetworkEnv, getRequiredNetworkEnv } from './networkEnv';

type ManifestEntry = {
    id: string;
    ownerAddress: string;
    fileName: string;
    name?: string;
    image?: string;
};

function readManifest(manifestPath: string): ManifestEntry[] {
    const raw = fs.readFileSync(manifestPath, 'utf8');
    const parsed = JSON.parse(raw) as unknown;

    if (!Array.isArray(parsed)) {
        throw new Error('Manifest must be a JSON array');
    }

    return parsed.map((entry, index) => {
        if (typeof entry !== 'object' || entry === null) {
            throw new Error(`Manifest row ${index + 1} must be an object`);
        }

        const row = entry as Partial<ManifestEntry>;
        if (!row.id || !row.ownerAddress || !row.fileName) {
            throw new Error(`Manifest row ${index + 1} must include id, ownerAddress, and fileName`);
        }

        return {
            id: String(row.id),
            ownerAddress: String(row.ownerAddress),
            fileName: String(row.fileName),
            name: row.name ? String(row.name) : undefined,
            image: row.image ? String(row.image) : undefined,
        };
    });
}

function resolveManifestPath(cwd: string, manifestValue: string): string {
    if (path.isAbsolute(manifestValue)) {
        return manifestValue;
    }
    return path.resolve(cwd, manifestValue);
}

function buildIndividualContent(fileName: string) {
    return beginCell()
        .storeStringTail(fileName)
        .endCell();
}

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function run(provider: NetworkProvider) {
    const cwd = process.cwd();
    const collectionAddress = Address.parse(getRequiredNetworkEnv(provider, 'COLLECTION_ADDRESS'));
    const manifestValue =
        getNetworkEnv(provider, 'BATCH_MINT_MANIFEST') ??
        path.join('metadata', 'generated', 'getgems_batch_mint_template', 'manifest.json');
    const manifestPath = resolveManifestPath(cwd, manifestValue);
    const perMintValue = toNano(getNetworkEnv(provider, 'BATCH_MINT_VALUE') ?? '0.1');
    const startIndex = Number(getNetworkEnv(provider, 'BATCH_MINT_START_INDEX') ?? '0');
    const limitEnv = getNetworkEnv(provider, 'BATCH_MINT_LIMIT');
    const delayMs = Number(getNetworkEnv(provider, 'BATCH_MINT_DELAY_MS') ?? '1500');
    const limit = limitEnv ? Number(limitEnv) : undefined;

    if (!fs.existsSync(manifestPath)) {
        throw new Error(`Manifest not found: ${manifestPath}`);
    }

    if (!Number.isInteger(startIndex) || startIndex < 0) {
        throw new Error('BATCH_MINT_START_INDEX must be an integer greater than or equal to 0');
    }

    if (limit !== undefined && (!Number.isInteger(limit) || limit <= 0)) {
        throw new Error('BATCH_MINT_LIMIT must be an integer greater than 0');
    }

    if (!Number.isInteger(delayMs) || delayMs < 0) {
        throw new Error('BATCH_MINT_DELAY_MS must be an integer greater than or equal to 0');
    }

    const manifest = readManifest(manifestPath);
    const endIndexExclusive = limit !== undefined ? startIndex + limit : manifest.length;
    const batch = manifest.slice(startIndex, endIndexExclusive);

    if (batch.length === 0) {
        throw new Error('No manifest rows selected for mint');
    }

    const nftCollection = provider.open(NftCollection.fromAddress(collectionAddress));
    const collectionData = await nftCollection.getGetCollectionData();

    provider.ui().write(`Network: ${provider.network()}`);
    provider.ui().write(`Collection: ${collectionAddress.toString()}`);
    provider.ui().write(`Manifest: ${manifestPath}`);
    provider.ui().write(`Current next_item_index: ${collectionData.next_item_index.toString()}`);
    provider.ui().write(`Selected rows: ${startIndex}..${startIndex + batch.length - 1}`);
    provider.ui().write(`Per mint value: ${perMintValue.toString()} nanotons`);
    provider.ui().write(`Delay: ${delayMs}ms`);

    for (const [offset, entry] of batch.entries()) {
        const owner = Address.parse(entry.ownerAddress);
        const progress = `${offset + 1}/${batch.length}`;

        provider.ui().write(
            `[${progress}] Minting id=${entry.id} file=${entry.fileName} owner=${owner.toString()}`,
        );

        await nftCollection.send(
            provider.sender(),
            { value: perMintValue },
            {
                $$type: 'Mint',
                owner,
                content: buildIndividualContent(entry.fileName),
            },
        );

        if (delayMs > 0 && offset < batch.length - 1) {
            await sleep(delayMs);
        }
    }

    provider.ui().write(`Batch mint submitted for ${batch.length} items.`);
}
