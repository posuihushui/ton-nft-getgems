import { useEffect, useState } from 'react';

import { PageHero, SurfaceCard } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getCollectionNfts, type GetgemsNetwork, type NftItem } from '@/lib/api';
import type { AsyncState } from '@/App';

type NftsPageProps = {
  network: GetgemsNetwork;
  health: AsyncState;
};

type LoadState = {
  loading: boolean;
  error: string | null;
};

export function NftsPage({ network, health }: NftsPageProps) {
  const collectionAddress = health.data?.collectionAddress ?? '';

  const [items, setItems] = useState<NftItem[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loadState, setLoadState] = useState<LoadState>({ loading: false, error: null });
  const [selectedNft, setSelectedNft] = useState<NftItem | null>(null);

  useEffect(() => {
    if (!collectionAddress) {
      return;
    }

    setItems([]);
    setCursor(null);
    setSelectedNft(null);
    void loadNfts(collectionAddress, undefined, true);
  }, [network, collectionAddress]);

  async function loadNfts(address: string, nextCursor?: string, reset = false) {
    setLoadState({ loading: true, error: null });

    try {
      const result = await getCollectionNfts(address, network, {
        limit: 24,
        cursor: nextCursor,
      });

      const newItems = result.response.items ?? [];

      setItems((current) => (reset ? newItems : [...current, ...newItems]));
      setCursor(result.response.cursor ?? null);
      setLoadState({ loading: false, error: null });
    } catch (error) {
      setLoadState({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load NFTs.',
      });
    }
  }

  function handleLoadMore() {
    if (!collectionAddress || !cursor) {
      return;
    }

    void loadNfts(collectionAddress, cursor);
  }

  function handleRefresh() {
    if (!collectionAddress) {
      return;
    }

    setItems([]);
    setCursor(null);
    setSelectedNft(null);
    void loadNfts(collectionAddress, undefined, true);
  }

  const getgemsCollectionUrl = collectionAddress
    ? `https://${network === 'testnet' ? 'testnet.' : ''}getgems.io/collection/${collectionAddress}`
    : null;

  return (
    <div className="flex flex-col gap-10 py-8 pb-16">
      <PageHero
        eyebrow="NFT Collection"
        title="Browse minted NFTs in your collection."
        description={
          collectionAddress
            ? `Showing items from collection ${collectionAddress.slice(0, 12)}...${collectionAddress.slice(-6)}`
            : health.loading
              ? 'Loading collection address from backend...'
              : 'Collection address not configured. Set GETGEMS_COLLECTION_ADDRESS in your .env file.'
        }
        actions={
          <div className="flex flex-wrap gap-4">
            {getgemsCollectionUrl ? (
              <a
                className="inline-flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                href={getgemsCollectionUrl}
                target="_blank"
                rel="noreferrer"
              >
                View on GetGems
              </a>
            ) : null}
            {collectionAddress ? (
              <Button variant="outline" onClick={handleRefresh} disabled={loadState.loading}>
                {loadState.loading ? 'Loading...' : 'Refresh'}
              </Button>
            ) : null}
          </div>
        }
      />

      {!collectionAddress && !health.loading ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 font-medium text-destructive">
          No collection address is configured. Set <code className="rounded bg-destructive/10 px-1">GETGEMS_COLLECTION_ADDRESS</code> in{' '}
          <code>apps/api/.env</code> and restart the backend.
        </div>
      ) : null}

      {loadState.error ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 font-medium text-destructive">
          {loadState.error}
        </div>
      ) : null}

      {selectedNft ? (
        <SurfaceCard title={selectedNft.name || 'Selected NFT'} description="Details for the currently selected item.">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
            <div className="overflow-hidden rounded-xl border border-border bg-muted">
              {selectedNft.image ? (
                <img src={selectedNft.image} alt={selectedNft.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex min-h-[280px] items-center justify-center text-sm text-muted-foreground">No image</div>
              )}
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-2xl font-bold">{selectedNft.name || 'Unnamed NFT'}</h3>
                  {selectedNft.sale ? <Badge>{selectedNft.sale.type}</Badge> : null}
                </div>
                <p className="text-sm leading-6 text-muted-foreground">
                  {selectedNft.description || 'No description provided.'}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <DetailBlock label="NFT Address" value={selectedNft.address} mono />
                <DetailBlock label="Owner" value={selectedNft.ownerAddress} mono />
                <DetailBlock label="Collection" value={selectedNft.collectionAddress} mono />
                <DetailBlock
                  label="Pricing"
                  value={
                    selectedNft.sale
                      ? `${selectedNft.sale.type}${selectedNft.sale.price ? ` - ${selectedNft.sale.price}` : ''} ${selectedNft.sale.currency}`
                      : 'Not listed'
                  }
                />
              </div>

              {selectedNft.attributes?.length ? (
                <div className="space-y-3 border-t pt-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Attributes</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedNft.attributes.map((attribute, index) => (
                      <div key={`${attribute.trait_type}-${index}`} className="rounded-lg border border-border bg-muted/40 px-3 py-2">
                        <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">
                          {attribute.trait_type}
                        </span>
                        <strong className="text-sm">{attribute.value}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="flex flex-wrap gap-3 border-t pt-4">
                <a
                  className="inline-flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                  href={`https://${network === 'testnet' ? 'testnet.' : ''}getgems.io/nft/${selectedNft.address}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open NFT on GetGems
                </a>
                <Button variant="outline" onClick={() => setSelectedNft(null)}>
                  Clear Selection
                </Button>
              </div>
            </div>
          </div>
        </SurfaceCard>
      ) : null}

      {items.length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {items.map((nft) => (
              <NftCard key={nft.address} nft={nft} onClick={() => setSelectedNft(nft)} />
            ))}
          </div>

          {cursor ? (
            <div className="flex justify-center">
              <Button variant="outline" onClick={handleLoadMore} disabled={loadState.loading}>
                {loadState.loading ? 'Loading...' : 'Load More'}
              </Button>
            </div>
          ) : (
            <p className="text-center text-xs font-medium italic text-muted-foreground">
              All {items.length} NFT{items.length !== 1 ? 's' : ''} loaded.
            </p>
          )}
        </div>
      ) : null}

      {!loadState.loading && !loadState.error && items.length === 0 && collectionAddress ? (
        <SurfaceCard title="No NFTs found" description="This collection has no minted NFTs yet, or the read API returned an empty list.">
          <div className="pt-4">
            <a
              className="inline-flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              href="/mint"
            >
              Mint your first NFT
            </a>
          </div>
        </SurfaceCard>
      ) : null}

      {loadState.loading && items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-32">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-sm font-bold text-muted-foreground">Loading NFTs from GetGems...</p>
        </div>
      ) : null}
    </div>
  );
}

function DetailBlock({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="space-y-1">
      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
      <p className={`rounded border border-border/50 bg-muted p-2 text-xs leading-tight ${mono ? 'font-mono break-all' : ''}`}>
        {value}
      </p>
    </div>
  );
}

function NftCard({ nft, onClick }: { nft: NftItem; onClick: () => void }) {
  const [imgError, setImgError] = useState(false);

  return (
    <button
      type="button"
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card text-left transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl"
      onClick={onClick}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-muted">
        {nft.image && !imgError ? (
          <img
            src={nft.image}
            alt={nft.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">No image</div>
        )}

        {nft.sale ? (
          <Badge className="absolute right-2 top-2 text-[10px] uppercase tracking-wider">{nft.sale.type}</Badge>
        ) : null}
      </div>

      <div className="space-y-2 p-3">
        <p className="truncate text-xs font-bold uppercase tracking-tight text-foreground transition-colors group-hover:text-blue-600">
          {nft.name || 'Unnamed NFT'}
        </p>
        {nft.attributes?.length ? (
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            {nft.attributes.length} attributes
          </p>
        ) : null}
        <p className="truncate border-t border-border/50 pt-2 text-[10px] font-mono text-muted-foreground/60">
          {nft.ownerAddress.slice(0, 8)}...{nft.ownerAddress.slice(-4)}
        </p>
      </div>
    </button>
  );
}
