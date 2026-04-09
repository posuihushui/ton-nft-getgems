import { useState, type FormEvent } from 'react';

import { FormField, PageHero, ResultPanel, SectionIntro, SurfaceCard, type OperationState } from '../components/ui';
import { deactivateApi, getWalletBalance, refundWallet, type GetgemsNetwork } from '../lib/api';
import type { AsyncState } from '../App';

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

  // Sync default when health payload arrives
  if (collectionAddress && !balanceForm.collectionAddress) {
    setBalanceForm((c) => ({ ...c, collectionAddress }));
    setRefundForm((c) => ({ ...c, collectionAddress }));
    setDeactivateForm((c) => ({ ...c, collectionAddress }));
  }

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
    <div className="page-stack">
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

      <div className="content-grid content-grid-two">
        <SurfaceCard
          title="Check wallet balance"
          description="Read the current balance of the underlying smart contract wallet for your active network."
        >
          <form className="operation-form" onSubmit={handleGetBalance}>
            <div className="form-grid">
              <FormField label="Collection address">
                <input
                  className="text-input"
                  value={balanceForm.collectionAddress}
                  onChange={(e) => setBalanceForm((c) => ({ ...c, collectionAddress: e.target.value }))}
                  required
                />
              </FormField>
            </div>
            <div className="form-actions">
              <button className="cta cta-dark" type="submit" disabled={balanceState.loading}>
                {balanceState.loading ? 'Checking...' : 'Check balance'}
              </button>
            </div>
          </form>

          <ResultPanel title="Balance result" state={balanceState} emptyMessage="Run a check to see the wallet state." />
        </SurfaceCard>

        <SurfaceCard
          title="Refund wallet"
          description="Withdraw all available TON from the minting wallet to an external receiver address."
        >
          <form className="operation-form" onSubmit={handleRefund}>
            <div className="form-grid">
              <FormField label="Collection address">
                <input
                  className="text-input"
                  value={refundForm.collectionAddress}
                  onChange={(e) => setRefundForm((c) => ({ ...c, collectionAddress: e.target.value }))}
                  required
                />
              </FormField>
              <FormField label="Receiver address">
                <input
                  className="text-input"
                  value={refundForm.receiverAddress}
                  onChange={(e) => setRefundForm((c) => ({ ...c, receiverAddress: e.target.value }))}
                  placeholder="UQ..."
                  required
                />
              </FormField>
            </div>
            <div className="form-actions">
              <button className="cta cta-primary" type="submit" disabled={refundState.loading}>
                {refundState.loading ? 'Processing...' : 'Execute refund'}
              </button>
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
        <form className="operation-form" onSubmit={handleDeactivate}>
          <div className="form-grid">
            <FormField label="Collection address">
              <input
                className="text-input"
                value={deactivateForm.collectionAddress}
                onChange={(e) => setDeactivateForm((c) => ({ ...c, collectionAddress: e.target.value }))}
                required
              />
            </FormField>
            <FormField label="Confirmation text" hint="Type DEACTIVATE to confirm">
              <input
                className="text-input"
                value={deactivateForm.confirmText}
                onChange={(e) => setDeactivateForm((c) => ({ ...c, confirmText: e.target.value }))}
                placeholder="DEACTIVATE"
                required
              />
            </FormField>
          </div>
          <div className="form-actions">
            <button className="cta cta-primary" style={{ background: '#c00' }} type="submit" disabled={deactivateState.loading}>
              {deactivateState.loading ? 'Deactivating...' : 'Deactivate API'}
            </button>
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
