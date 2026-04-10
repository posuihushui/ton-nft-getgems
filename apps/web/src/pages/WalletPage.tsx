import { useEffect, useState, type FormEvent } from 'react';

import { FormField, PageHero, ResultPanel, SectionIntro, SurfaceCard, type OperationState } from '@/components/ui';
import { deactivateApi, getWalletBalance, refundWallet, type GetgemsNetwork } from '@/lib/api';
import type { AsyncState } from '@/App';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type WalletPageProps = {
  network: GetgemsNetwork;
  health: AsyncState;
};

const emptyOperationState = (): OperationState => ({
  loading: false,
  error: null,
  result: null,
});

export function WalletPage({ network, health }: WalletPageProps) {
  const collectionAddress = health.data?.collectionAddress ?? '';

  const [balanceState, setBalanceState] = useState<OperationState>(emptyOperationState);
  const [refundState, setRefundState] = useState<OperationState>(emptyOperationState);
  const [deactivateState, setDeactivateState] = useState<OperationState>(emptyOperationState);

  const [balanceForm, setBalanceForm] = useState({
    collectionAddress,
  });

  const [refundForm, setRefundForm] = useState({
    collectionAddress,
    receiverAddress: '',
  });

  const [deactivateForm, setDeactivateForm] = useState({
    collectionAddress,
    confirmText: '',
  });

  useEffect(() => {
    if (!collectionAddress) {
      return;
    }

    setBalanceForm((current) => (current.collectionAddress ? current : { ...current, collectionAddress }));
    setRefundForm((current) => (current.collectionAddress ? current : { ...current, collectionAddress }));
    setDeactivateForm((current) => (current.collectionAddress ? current : { ...current, collectionAddress }));
  }, [collectionAddress]);

  async function handleGetBalance(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBalanceState({ loading: true, error: null, result: null });
    try {
      const result = await getWalletBalance(balanceForm.collectionAddress, network);
      setBalanceState({ loading: false, error: null, result });
    } catch (error) {
      setBalanceState({ loading: false, error: getErrorMessage(error), result: null });
    }
  }

  async function handleRefund(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRefundState({ loading: true, error: null, result: null });
    try {
      const result = await refundWallet(refundForm.collectionAddress, refundForm.receiverAddress, network);
      setRefundState({ loading: false, error: null, result });
    } catch (error) {
      setRefundState({ loading: false, error: getErrorMessage(error), result: null });
    }
  }

  async function handleDeactivate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (deactivateForm.confirmText !== 'DEACTIVATE') {
      setDeactivateState({ loading: false, error: 'You must type DEACTIVATE to confirm.', result: null });
      return;
    }
    setDeactivateState({ loading: true, error: null, result: null });
    try {
      const result = await deactivateApi(deactivateForm.collectionAddress, network);
      setDeactivateState({ loading: false, error: null, result });
    } catch (error) {
      setDeactivateState({ loading: false, error: getErrorMessage(error), result: null });
    }
  }

  return (
    <div className="flex flex-col gap-12 pb-8">
      <PageHero
        eyebrow="Wallet operations"
        title="Manage the minting wallet assigned to your collection."
        description="Check gas balance before mint operations, withdraw funds when the project completes, or immediately deactivate your API keys."
      />

      <SectionIntro
        eyebrow="Funds control"
        title="Verify and process fund withdrawals safely."
        description="The Getgems API operates non-custodially, but requires gas for network fees. You can refund unused balance to a secure external address."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <SurfaceCard
          title="Check wallet balance"
          description="Read the current balance of the underlying smart contract wallet for your active network."
        >
          <form className="space-y-6" onSubmit={handleGetBalance}>
            <FormField label="Collection address">
              <Input
                value={balanceForm.collectionAddress}
                onChange={(e) => setBalanceForm((c) => ({ ...c, collectionAddress: e.target.value }))}
                required
              />
            </FormField>
            <div className="flex justify-end border-t border-black/6 pt-4">
              <Button type="submit" variant="secondary" disabled={balanceState.loading} className="w-full sm:w-auto px-6">
                {balanceState.loading ? 'Checking...' : 'Check balance'}
              </Button>
            </div>
          </form>

          <ResultPanel title="Balance result" state={balanceState} emptyMessage="Run a check to see the wallet state." />
        </SurfaceCard>

        <SurfaceCard
          title="Refund wallet"
          description="Withdraw all available TON from the minting wallet to an external receiver address."
        >
          <form className="space-y-6" onSubmit={handleRefund}>
            <div className="space-y-4">
              <FormField label="Collection address">
                <Input
                  value={refundForm.collectionAddress}
                  onChange={(e) => setRefundForm((c) => ({ ...c, collectionAddress: e.target.value }))}
                  required
                />
              </FormField>
              <FormField label="Receiver address">
                <Input
                  value={refundForm.receiverAddress}
                  onChange={(e) => setRefundForm((c) => ({ ...c, receiverAddress: e.target.value }))}
                  placeholder="UQ..."
                  required
                />
              </FormField>
            </div>
            <div className="flex justify-end border-t border-black/6 pt-4">
              <Button type="submit" disabled={refundState.loading} className="w-full sm:w-auto px-8">
                {refundState.loading ? 'Processing...' : 'Execute refund'}
              </Button>
            </div>
          </form>

          <ResultPanel title="Refund result" state={refundState} emptyMessage="Result will appear after execution." />
        </SurfaceCard>
      </div>

      <SectionIntro
        eyebrow="Security Operations"
        title="Deactivate the collection operator API."
        description="If you suspect an API key compromise, use this function to entirely block the collection's API from issuing further mint requests."
      />

      <SurfaceCard title="Deactivate API" description="This action immediately stops all API operations and is irreversible. Proceed with extreme caution.">
        <form className="space-y-6" onSubmit={handleDeactivate}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Collection address">
              <Input
                value={deactivateForm.collectionAddress}
                onChange={(e) => setDeactivateForm((c) => ({ ...c, collectionAddress: e.target.value }))}
                required
              />
            </FormField>
            <FormField label="Confirmation text" hint="Type DEACTIVATE to confirm">
              <Input
                value={deactivateForm.confirmText}
                onChange={(e) => setDeactivateForm((c) => ({ ...c, confirmText: e.target.value }))}
                placeholder="DEACTIVATE"
                required
                className="border-destructive/50 focus-visible:ring-destructive/50"
              />
            </FormField>
          </div>
          <div className="flex justify-end border-t border-black/6 pt-4">
            <Button
              variant="destructive"
              type="submit"
              disabled={deactivateState.loading}
              className="w-full sm:w-auto px-8"
            >
              {deactivateState.loading ? 'Deactivating...' : 'Deactivate API'}
            </Button>
          </div>
        </form>

        <ResultPanel title="Deactivation result" state={deactivateState} emptyMessage="Safety lock status will render here." />
      </SurfaceCard>
    </div>
  );
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unexpected request failure.';
}
