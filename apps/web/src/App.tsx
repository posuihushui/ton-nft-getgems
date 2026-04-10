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
      <div className="min-h-screen bg-background text-foreground">
        <header className="apple-glass-nav sticky top-0 z-50 w-full border-b border-white/10">
          <div className="mx-auto flex h-12 w-full max-w-[1120px] items-center justify-between gap-4 px-4 md:px-6">
            <NavLink className="no-underline text-[12px] font-medium tracking-[-0.01em] text-white transition-opacity hover:opacity-80" to="/">
              TON GetGems Issuer
            </NavLink>

            <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
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
                      "relative no-underline px-3 py-2 text-[12px] font-normal tracking-[-0.01em] text-white/72 transition-colors hover:text-white",
                      isActive &&
                        "text-white after:absolute after:bottom-1 after:left-3 after:right-3 after:h-px after:bg-white/90 after:content-['']"
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-1 rounded-full bg-white/6 p-1 ring-1 ring-white/10">
              {enabledNetworks.map((candidate) => (
                <Button
                  key={candidate}
                  variant={candidate === network ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "h-7 px-3 text-[11px] font-semibold uppercase tracking-[0.08em]",
                    candidate === network
                      ? "bg-primary text-white hover:bg-[#0077ed]"
                      : "text-white/68 hover:bg-white/10 hover:text-white"
                  )}
                  onClick={() => setNetwork(candidate)}
                >
                  {candidate}
                </Button>
              ))}
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1120px] px-4 pb-24 pt-8 md:px-6 md:pt-10">
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
