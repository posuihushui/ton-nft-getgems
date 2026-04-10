import { Link } from 'react-router-dom';

import type { GetgemsNetwork, HealthPayload } from '../lib/api';
import { PageHero, SectionIntro, StatGrid, SurfaceCard } from '../components/ui';
import { Button } from '@/components/ui/button';

type DashboardPageProps = {
  network: GetgemsNetwork;
  health: {
    loading: boolean;
    data: HealthPayload | null;
    error: string | null;
  };
  onRefresh: () => void;
};

const launchChecklist = [
  'Mainnet and testnet API keys exist and are scoped to the right operator wallet.',
  'Mint wallet balance has been verified on the selected network before creating requests.',
  'Request IDs are stored server-side so retries remain idempotent.',
  'Metadata URLs and media URLs are stable and point to production storage.',
  'The selected network Swagger and the backend health endpoint agree on the active host.',
];

const routeCards = [
  {
    title: 'NFTs',
    body: 'Browse and inspect all minted NFTs in your collection. Load detailed attributes, owner info, and GetGems links.',
    href: '/nfts',
  },
  {
    title: 'Mint Operations',
    body: 'Run single and batch mints routed to specific owner addresses via CSV upload, manual form, or raw JSON.',
    href: '/mint',
  },
  {
    title: 'Wallet Ops',
    body: 'Check your current mint wallet balance, request refunds, or deactivate your operator API keys.',
    href: '/wallet',
  },
];

const docs = [
  ['Selected Swagger', 'https://api.getgems.io/public-api/docs'],
  ['Testnet Swagger', 'https://api.testnet.getgems.io/public-api/docs'],
  ['Minting guide', 'https://github.com/getgems-io/nft-contracts/blob/main/docs/minting-api-en.md'],
  ['Metadata guide', 'https://github.com/getgems-io/nft-contracts/blob/main/docs/metadata.md'],
];

function getSwaggerLink(network: GetgemsNetwork): string {
  return network === 'testnet'
    ? 'https://api.testnet.getgems.io/public-api/docs'
    : 'https://api.getgems.io/public-api/docs';
}

export function DashboardPage({ network, health, onRefresh }: DashboardPageProps) {
  const healthData = health.data;
  const stats = [
    {
      label: 'Selected network',
      value: healthData?.selectedNetwork ?? network,
    },
    {
      label: 'Default network',
      value: healthData?.defaultNetwork ?? 'unknown',
    },
    {
      label: 'Runtime',
      value: healthData?.environment ?? 'unavailable',
    },
    {
      label: 'API key state',
      value: health.error ? 'Unavailable' : healthData?.getgemsConfigured ? 'Configured' : 'Missing',
    },
  ];

  return (
    <div className="flex flex-col gap-12 py-8 pb-16">
      <PageHero
        eyebrow="Operations overview"
        title="A production-oriented control surface for Getgems launches."
        description="Use the Dashboard to verify environment routing, confirm credentials, and jump into collection or mint operations without losing your selected network."
        actions={
          <div className="flex flex-wrap gap-4">
            <Button asChild>
              <a href={getSwaggerLink(network)} target="_blank" rel="noreferrer">
                Open {network} Swagger
              </a>
            </Button>
            <Button variant="outline" onClick={onRefresh}>
              Refresh health
            </Button>
          </div>
        }
      />

      <SectionIntro
        eyebrow="Environment state"
        title="Confirm the console is pointing at the right network before you mint."
        description="The backend resolves the active Getgems host per request, but the dashboard should still make the current environment obvious at a glance."
      />

      <StatGrid items={stats} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SurfaceCard
          title="Getgems connectivity"
          description="The health endpoint reflects the currently selected network and the actual Getgems base URL used by the backend."
          headerAction={
            <Button variant="ghost" size="sm" onClick={onRefresh} className="h-8 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50">
              Refresh
            </Button>
          }
        >
          {health.loading ? <p className="text-sm text-muted-foreground animate-pulse">Checking backend connectivity now.</p> : null}
          {health.error ? <p className="text-sm text-destructive font-medium">{health.error}</p> : null}
          {healthData ? (
            <div className="space-y-4">
              {[
                { label: 'Backend service', value: healthData.service },
                { label: 'Selected host', value: healthData.getgemsBaseUrl },
                { label: 'Mainnet key', value: healthData.networkConfig.mainnet ? 'Configured' : 'Missing' },
                { label: 'Testnet key', value: healthData.networkConfig.testnet ? 'Configured' : 'Missing' },
              ].map((item) => (
                <div key={item.label} className="flex flex-col gap-1">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{item.label}</span>
                  <strong className="text-sm font-semibold truncate text-foreground">{item.value}</strong>
                </div>
              ))}
            </div>
          ) : null}
        </SurfaceCard>

        <SurfaceCard
          title="Launch checklist"
          description="A lightweight preflight list before you move from testnet rehearsal to mainnet issuance."
        >
          <ul className="space-y-3">
            {launchChecklist.map((item) => (
              <li key={item} className="text-sm text-muted-foreground flex gap-2">
                <span className="text-blue-600 font-bold shrink-0">•</span>
                {item}
              </li>
            ))}
          </ul>
        </SurfaceCard>
      </div>

      <SectionIntro
        eyebrow="Primary work areas"
        title="Jump straight into the operation you need."
        description="The control surface is organized by operator intent: collection setup first, mint execution second."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 leading-relaxed">
        {routeCards.map((card) => (
          <SurfaceCard key={card.title} title={card.title} description={card.body}>
            <div className="mt-4">
              <Button asChild className="w-full sm:w-auto">
                <Link to={card.href}>
                  Open {card.title}
                </Link>
              </Button>
            </div>
          </SurfaceCard>
        ))}
      </div>

      <SectionIntro
        eyebrow="Documentation"
        title="Keep the official references close to the operator workflow."
        description="Use the current network selection to open the matching Swagger UI, but keep the minting and metadata references close as well."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {docs.map(([label, href]) => {
          const resolvedHref = label === 'Selected Swagger' ? getSwaggerLink(network) : href;

          return (
            <a
              key={label}
              href={resolvedHref}
              target="_blank"
              rel="noreferrer"
              className="group bg-card border border-border p-4 rounded-lg transition-all hover:border-blue-200 hover:shadow-md hover:-translate-y-0.5"
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-blue-600 transition-colors">
                {label}
              </span>
              <strong className="block text-sm font-bold mt-1 truncate text-foreground group-hover:underline underline-offset-4 decoration-blue-500/30">
                {resolvedHref}
              </strong>
            </a>
          );
        })}
      </div>
    </div>
  );
}
