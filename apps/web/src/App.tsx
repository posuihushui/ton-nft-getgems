import { startTransition, useEffect, useState } from 'react';
import { BrowserRouter, NavLink, Outlet, Route, Routes, useOutletContext } from 'react-router-dom';

import {
  getDefaultNetwork,
  getEnabledNetworks,
  getHealth,
  type GetgemsNetwork,
  type HealthPayload,
} from './lib/api';

import { DashboardPage } from './pages/DashboardPage';
import { MintPage } from './pages/MintPage';
import { NftsPage } from './pages/NftsPage';
import { WalletPage } from './pages/WalletPage';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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

  const refreshHealth = async (selectedNetwork: GetgemsNetwork = network) => {
    startTransition(() => {
      setHealth((current) => ({ ...current, loading: true }));
    });

    try {
      const payload = await getHealth(selectedNetwork);
      startTransition(() => {
        setHealth({ loading: false, data: payload, error: null });
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      startTransition(() => {
        setHealth({ loading: false, data: null, error: message });
      });
    }
  };

  useEffect(() => {
    void refreshHealth(network);
    const timer = window.setInterval(() => {
      void refreshHealth(network);
    }, 30000);
    return () => window.clearInterval(timer);
  }, [network]);

  const contextValue: NetworkContextType = { network, health, refreshHealth };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background text-foreground selection:bg-blue-100">
        <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
          <div className="container mx-auto max-w-5xl h-14 flex items-center justify-between px-4">
            <NavLink className="text-sm font-bold tracking-tight hover:opacity-80 transition-opacity" to="/">
              TON GetGems Issuer
            </NavLink>

            <nav className="hidden md:flex items-center gap-6 ml-6" aria-label="Primary">
              {[
                { to: '/', label: 'Dashboard' },
                { to: '/nfts', label: 'NFTs' },
                { to: '/mint', label: 'Mint' },
                { to: '/wallet', label: 'Wallet' },
              ].map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    cn(
                      "text-xs font-medium transition-colors hover:text-blue-600",
                      isActive ? "text-blue-600 font-semibold" : "text-muted-foreground"
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              {enabledNetworks.map((candidate) => (
                <Button
                  key={candidate}
                  variant={candidate === network ? "default" : "outline"}
                  size="sm"
                  className="h-8 px-3 text-[11px] font-bold uppercase tracking-wider transition-all"
                  onClick={() => setNetwork(candidate)}
                >
                  {candidate}
                </Button>
              ))}
            </div>
          </div>
        </header>

        <main className="container mx-auto max-w-5xl px-4">
          <Outlet context={contextValue} />
        </main>
      </div>
    </TooltipProvider>
  );
}

export function useNetworkContext() {
  return useOutletContext<NetworkContextType>();
}

function DashboardRoute() {
  const { network, health, refreshHealth } = useNetworkContext();
  return <DashboardPage network={network} health={health} onRefresh={refreshHealth} />;
}

function NftsRoute() {
  const { network, health } = useNetworkContext();
  return <NftsPage network={network} health={health} />;
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
          <Route path="nfts" element={<NftsRoute />} />
          <Route path="mint" element={<MintRoute />} />
          <Route path="wallet" element={<WalletRoute />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

