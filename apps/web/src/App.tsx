import { startTransition, useEffect, useEffectEvent, useState } from 'react';
import { BrowserRouter, NavLink, Outlet, Route, Routes, useOutletContext } from 'react-router-dom';

import {
  getDefaultNetwork,
  getEnabledNetworks,
  getHealth,
  type GetgemsNetwork,
  type HealthPayload,
} from './lib/api';

import { CollectionsPage } from './pages/CollectionsPage';
import { DashboardPage } from './pages/DashboardPage';
import { MintPage } from './pages/MintPage';
import { WalletPage } from './pages/WalletPage';

export type AsyncState = {
  loading: boolean;
  data: HealthPayload | null;
  error: string | null;
};

export type NetworkContextType = {
  network: GetgemsNetwork;
  health: AsyncState;
  refreshHealth: () => void;
};

const enabledNetworks = getEnabledNetworks();
const initialNetwork = getDefaultNetwork();

function Layout() {
  const [network, setNetwork] = useState<GetgemsNetwork>(
    enabledNetworks.includes(initialNetwork) ? initialNetwork : enabledNetworks[0],
  );
  const [health, setHealth] = useState<AsyncState>({
    loading: true,
    data: null,
    error: null,
  });

  const refreshHealth = useEffectEvent(async () => {
    startTransition(() => {
      setHealth((current) => ({ ...current, loading: true }));
    });

    try {
      const payload = await getHealth(network);
      startTransition(() => {
        setHealth({ loading: false, data: payload, error: null });
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      startTransition(() => {
        setHealth({ loading: false, data: null, error: message });
      });
    }
  });

  useEffect(() => {
    void refreshHealth();
    const timer = window.setInterval(() => {
      void refreshHealth();
    }, 30000);
    return () => window.clearInterval(timer);
  }, [network, refreshHealth]);

  const contextValue: NetworkContextType = { network, health, refreshHealth };

  return (
    <div className="app-shell">
      <header className="global-nav">
        <div className="nav-inner">
          <NavLink className="brand" to="/">
            TON Getgems Issuer
          </NavLink>

          <nav className="nav-links" aria-label="Primary">
            <NavLink to="/">Dashboard</NavLink>
            <NavLink to="/collections">Collections</NavLink>
            <NavLink to="/mint">Minting</NavLink>
            <NavLink to="/wallet">Wallet</NavLink>
          </nav>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {enabledNetworks.map((candidate) => (
              <button
                key={candidate}
                type="button"
                className={`network-toggle${candidate === network ? ' is-active' : ''}`}
                onClick={() => setNetwork(candidate)}
                style={{ minHeight: '28px', padding: '4px 12px', fontSize: '13px', borderRadius: '6px', borderWidth: '2px' }}
              >
                {candidate}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main>
        <Outlet context={contextValue} />
      </main>
    </div>
  );
}

export function useNetworkContext() {
  return useOutletContext<NetworkContextType>();
}

function DashboardRoute() {
  const { network, health, refreshHealth } = useNetworkContext();
  return <DashboardPage network={network} health={health} onRefresh={refreshHealth} />;
}

function CollectionsRoute() {
  const { network, health } = useNetworkContext();
  return <CollectionsPage network={network} health={health} />;
}

function MintRoute() {
  const { network, health } = useNetworkContext();
  return <MintPage network={network} health={health} />;
}

function WalletRoute() {
  const { network, health } = useNetworkContext();
  return <WalletPage network={network} health={health} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardRoute />} />
          <Route path="collections" element={<CollectionsRoute />} />
          <Route path="mint" element={<MintRoute />} />
          <Route path="wallet" element={<WalletRoute />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
