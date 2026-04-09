import { Link } from 'react-router-dom';

import type { GetgemsNetwork, HealthPayload } from '../lib/api';
import { PageHero, SectionIntro, StatGrid, SurfaceCard } from '../components/ui';

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
    title: 'Collections',
    body: 'Create collection requests, upload media credentials, and patch collection metadata from one place.',
    href: '/collections',
  },
  {
    title: 'Mint Operations',
    body: 'Run single and batch mints, inspect request status, read wallet balance, and patch NFT metadata.',
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
    <div className="page-stack">
      <PageHero
        eyebrow="Operations overview"
        title="A production-oriented control surface for Getgems launches."
        description="Use the Dashboard to verify environment routing, confirm credentials, and jump into collection or mint operations without losing your selected network."
        actions={
          <>
            <a className="cta cta-primary" href={getSwaggerLink(network)} target="_blank" rel="noreferrer">
              Open {network} Swagger
            </a>
            <button className="cta cta-dark" type="button" onClick={onRefresh}>
              Refresh health
            </button>
          </>
        }
      />

      <SectionIntro
        eyebrow="Environment state"
        title="Confirm the console is pointing at the right network before you mint."
        description="The backend resolves the active Getgems host per request, but the dashboard should still make the current environment obvious at a glance."
      />

      <StatGrid items={stats} />

      <div className="content-grid content-grid-two">
        <SurfaceCard
          title="Getgems connectivity"
          description="The health endpoint reflects the currently selected network and the actual Getgems base URL used by the backend."
          headerAction={
            <button className="inline-button" type="button" onClick={onRefresh}>
              Refresh
            </button>
          }
        >
          {health.loading ? <p className="support-copy">Checking backend connectivity now.</p> : null}
          {health.error ? <p className="support-error">{health.error}</p> : null}
          {healthData ? (
            <div className="detail-list">
              <div>
                <span>Backend service</span>
                <strong>{healthData.service}</strong>
              </div>
              <div>
                <span>Selected host</span>
                <strong>{healthData.getgemsBaseUrl}</strong>
              </div>
              <div>
                <span>Mainnet key</span>
                <strong>{healthData.networkConfig.mainnet ? 'Configured' : 'Missing'}</strong>
              </div>
              <div>
                <span>Testnet key</span>
                <strong>{healthData.networkConfig.testnet ? 'Configured' : 'Missing'}</strong>
              </div>
            </div>
          ) : null}
        </SurfaceCard>

        <SurfaceCard
          title="Launch checklist"
          description="A lightweight preflight list before you move from testnet rehearsal to mainnet issuance."
        >
          <ul className="bullet-list">
            {launchChecklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </SurfaceCard>
      </div>

      <SectionIntro
        eyebrow="Primary work areas"
        title="Jump straight into the operation you need."
        description="The control surface is organized by operator intent: collection setup first, mint execution second."
      />

      <div className="content-grid content-grid-two">
        {routeCards.map((card) => (
          <SurfaceCard key={card.title} title={card.title} description={card.body}>
            <div className="card-actions">
              <Link className="cta cta-primary" to={card.href}>
                Open {card.title}
              </Link>
            </div>
          </SurfaceCard>
        ))}
      </div>

      <SectionIntro
        eyebrow="Documentation"
        title="Keep the official references close to the operator workflow."
        description="Use the current network selection to open the matching Swagger UI, but keep the minting and metadata references close as well."
      />

      <div className="docs-grid">
        {docs.map(([label, href]) => {
          const resolvedHref = label === 'Selected Swagger' ? getSwaggerLink(network) : href;

          return (
            <a className="doc-card" key={label} href={resolvedHref} target="_blank" rel="noreferrer">
              <span>{label}</span>
              <strong>{resolvedHref}</strong>
            </a>
          );
        })}
      </div>
    </div>
  );
}
