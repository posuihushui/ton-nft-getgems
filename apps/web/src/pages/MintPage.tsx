import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';

import { FormField, PageHero, ResultPanel, SurfaceCard, type OperationState } from '@/components/ui';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  createBatchMintV2,
  createSingleMint,
  getMintStatus,
  getMintTasks,
  updateNftMetadata,
  type GetgemsNetwork,
} from '@/lib/api';
import type { AsyncState } from '@/App';
import { downloadCsv, generateCsvTemplate, parseCsvFile, type BatchMintItem } from '@/lib/csv';

type MintPageProps = {
  network: GetgemsNetwork;
  health: AsyncState;
};

type MintTab = 'batch' | 'single' | 'update' | 'check';
type BatchMode = 'csv' | 'manual' | 'json';

const emptyOperationState = (): OperationState => ({
  loading: false,
  error: null,
  result: null,
});

const mintTabs: Array<{ id: MintTab; label: string }> = [
  { id: 'batch', label: 'Batch Mint' },
  { id: 'single', label: 'Single Mint' },
  { id: 'update', label: 'Update NFT' },
  { id: 'check', label: 'Check Status' },
];

const batchModes: Array<{ id: BatchMode; label: string }> = [
  { id: 'csv', label: 'CSV Upload' },
  { id: 'manual', label: 'Manual Build' },
  { id: 'json', label: 'Raw JSON' },
];

export function MintPage({ network, health }: MintPageProps) {
  const defaultCollectionAddress = health.data?.collectionAddress ?? '';

  const [singleMintState, setSingleMintState] = useState<OperationState>(emptyOperationState);
  const [batchMintState, setBatchMintState] = useState<OperationState>(emptyOperationState);
  const [statusState, setStatusState] = useState<OperationState>(emptyOperationState);
  const [tasksState, setTasksState] = useState<OperationState>(emptyOperationState);
  const [updateNftState, setUpdateNftState] = useState<OperationState>(emptyOperationState);

  const [singleMintForm, setSingleMintForm] = useState({
    collectionAddress: defaultCollectionAddress,
    requestId: String(Date.now()),
    ownerAddress: '',
    name: '',
    description: '',
    image: '',
    lottie: '',
    contentUrl: '',
    index: '',
    attributesJson: '[]',
    buttonsJson: '[]',
  });

  const [statusForm, setStatusForm] = useState({
    collectionAddress: defaultCollectionAddress,
    requestId: '',
  });

  const [tasksForm, setTasksForm] = useState({
    collectionAddress: defaultCollectionAddress,
    limit: '10',
    after: '',
    reverse: false,
  });

  const [updateNftForm, setUpdateNftForm] = useState({
    collectionAddress: defaultCollectionAddress,
    nftAddress: '',
    name: '',
    description: '',
    image: '',
    attributesJson: '[]',
    upsertAttributesJson: '[]',
    buttonsJson: '[]',
  });

  const [activeTab, setActiveTab] = useState<MintTab>('batch');
  const [batchMode, setBatchMode] = useState<BatchMode>('csv');
  const [batchCollectionAddress, setBatchCollectionAddress] = useState(defaultCollectionAddress);
  const [batchRequestId, setBatchRequestId] = useState(String(Date.now() + 1));
  const [batchItems, setBatchItems] = useState<BatchMintItem[]>([]);
  const [batchRawJson, setBatchRawJson] = useState('[\n  \n]');
  const [csvParseError, setCsvParseError] = useState<string | null>(null);

  useEffect(() => {
    if (!defaultCollectionAddress) {
      return;
    }

    setSingleMintForm((current) =>
      current.collectionAddress ? current : { ...current, collectionAddress: defaultCollectionAddress },
    );
    setStatusForm((current) =>
      current.collectionAddress ? current : { ...current, collectionAddress: defaultCollectionAddress },
    );
    setTasksForm((current) =>
      current.collectionAddress ? current : { ...current, collectionAddress: defaultCollectionAddress },
    );
    setUpdateNftForm((current) =>
      current.collectionAddress ? current : { ...current, collectionAddress: defaultCollectionAddress },
    );
    setBatchCollectionAddress((current) => current || defaultCollectionAddress);
  }, [defaultCollectionAddress]);

  async function handleSingleMint(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSingleMintState({ loading: true, error: null, result: null });

    try {
      const result = await createSingleMint(
        singleMintForm.collectionAddress,
        compactObject({
          requestId: singleMintForm.requestId,
          ownerAddress: singleMintForm.ownerAddress,
          name: singleMintForm.name,
          description: singleMintForm.description,
          image: singleMintForm.image,
          lottie: toOptionalString(singleMintForm.lottie),
          content_url: toOptionalString(singleMintForm.contentUrl),
          index: singleMintForm.index ? Number(singleMintForm.index) : undefined,
          attributes: parseJsonArray(singleMintForm.attributesJson, 'Attributes'),
          buttons: parseJsonArray(singleMintForm.buttonsJson, 'Buttons'),
        }),
        network,
      );

      setSingleMintState({ loading: false, error: null, result });
    } catch (error) {
      setSingleMintState({ loading: false, error: getErrorMessage(error), result: null });
    }
  }

  function handleDownloadTemplate() {
    downloadCsv(generateCsvTemplate(), 'getgems_batch_mint_template.csv');
  }

  async function handleCsvUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setCsvParseError(null);

    try {
      const result = await parseCsvFile(file);

      if (result.errors.length > 0) {
        setCsvParseError(`Found ${result.errors.length} row errors. Review the preview before submitting.`);
      }

      setBatchItems(result.items);
      event.target.value = '';
    } catch (error) {
      setCsvParseError(getErrorMessage(error));
    }
  }

  function handleBatchModeChange(mode: BatchMode) {
    if (mode === 'json' && batchMode !== 'json') {
      setBatchRawJson(JSON.stringify(batchItems, null, 2));
    }

    if (batchMode === 'json' && mode !== 'json') {
      try {
        const parsed = JSON.parse(batchRawJson) as unknown;
        if (Array.isArray(parsed)) {
          setBatchItems(parsed as BatchMintItem[]);
        }
      } catch {
        // Keep current items when switching away from invalid JSON.
      }
    }

    setBatchMode(mode);
  }

  function handleAddManualItem() {
    setBatchItems((current) => [
      ...current,
      {
        ownerAddress: '',
        name: '',
        description: '',
        image: '',
        attributes: [],
      },
    ]);
  }

  function handleRemoveItem(index: number) {
    setBatchItems((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  function handleUpdateItem(index: number, field: keyof BatchMintItem, value: BatchMintItem[keyof BatchMintItem]) {
    setBatchItems((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item)),
    );
  }

  async function handleBatchMint(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBatchMintState({ loading: true, error: null, result: null });

    let finalItems: BatchMintItem[];

    if (batchMode === 'json') {
      try {
        finalItems = (parseJsonArray(batchRawJson, 'Batch items JSON') ?? []) as BatchMintItem[];
      } catch (error) {
        setBatchMintState({ loading: false, error: getErrorMessage(error), result: null });
        return;
      }
    } else {
      finalItems = batchItems;
    }

    if (finalItems.length < 1 || finalItems.length > 100) {
      setBatchMintState({
        loading: false,
        error: `Batch Mint API requires 1 to 100 items. Current count: ${finalItems.length}.`,
        result: null,
      });
      return;
    }

    try {
      const payloadItems = finalItems.map((item, index) => ({
        ...item,
        requestId: `${batchRequestId}-${index}`,
      }));

      const result = await createBatchMintV2(batchCollectionAddress, { items: payloadItems }, network);
      setBatchMintState({ loading: false, error: null, result });
    } catch (error) {
      setBatchMintState({ loading: false, error: getErrorMessage(error), result: null });
    }
  }

  async function handleStatusLookup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatusState({ loading: true, error: null, result: null });

    try {
      const result = await getMintStatus(statusForm.collectionAddress, statusForm.requestId, network);
      setStatusState({ loading: false, error: null, result });
    } catch (error) {
      setStatusState({ loading: false, error: getErrorMessage(error), result: null });
    }
  }

  async function handleTaskLookup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTasksState({ loading: true, error: null, result: null });

    try {
      const result = await getMintTasks(tasksForm.collectionAddress, network, {
        limit: tasksForm.limit ? Number(tasksForm.limit) : undefined,
        after: toOptionalString(tasksForm.after),
        reverse: tasksForm.reverse,
      });
      setTasksState({ loading: false, error: null, result });
    } catch (error) {
      setTasksState({ loading: false, error: getErrorMessage(error), result: null });
    }
  }

  async function handleUpdateNft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setUpdateNftState({ loading: true, error: null, result: null });

    try {
      const result = await updateNftMetadata(
        updateNftForm.collectionAddress,
        updateNftForm.nftAddress,
        {
          update: compactObject({
            name: toOptionalString(updateNftForm.name),
            description: toOptionalString(updateNftForm.description),
            image: toOptionalString(updateNftForm.image),
            attributes: parseJsonArray(updateNftForm.attributesJson, 'Attributes'),
            upsertAttributes: parseJsonArray(updateNftForm.upsertAttributesJson, 'Upsert attributes'),
            buttons: parseJsonArray(updateNftForm.buttonsJson, 'Buttons'),
          }),
        },
        network,
      );

      setUpdateNftState({ loading: false, error: null, result });
    } catch (error) {
      setUpdateNftState({ loading: false, error: getErrorMessage(error), result: null });
    }
  }

  return (
    <div className="flex flex-col gap-10 py-8 pb-16">
      <PageHero
        eyebrow="Mint execution"
        title="Operate single mint, batch mint, and monitoring workflows from one page."
        description="Submit mints to designated owner addresses, inspect request state, and patch NFT metadata on the active network."
      />

      <div className="flex flex-wrap gap-2">
        {mintTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${
              activeTab === tab.id
                ? 'border-blue-600 bg-blue-600 text-white'
                : 'border-border bg-background text-foreground hover:bg-muted'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'batch' ? (
        <SurfaceCard
          title="Batch mint"
          description="Mint up to 100 NFTs in a single request flow using CSV, manual entry, or raw JSON."
        >
          <form className="space-y-8" onSubmit={handleBatchMint}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField label="Collection address">
                <Input value={batchCollectionAddress} onChange={(e) => setBatchCollectionAddress(e.target.value)} required />
              </FormField>
              <FormField label="Base request ID">
                <Input value={batchRequestId} onChange={(e) => setBatchRequestId(e.target.value)} required />
              </FormField>
            </div>

            <div className="flex flex-wrap gap-2">
              {batchModes.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => handleBatchModeChange(mode.id)}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                    batchMode === mode.id
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-border bg-background text-foreground hover:bg-muted'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>

            {batchMode === 'csv' ? (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-4">
                  <Button type="button" variant="outline" size="sm" onClick={handleDownloadTemplate}>
                    Download CSV Template
                  </Button>
                  <label className="inline-flex cursor-pointer items-center rounded-lg border border-dashed px-4 py-2 text-sm font-medium hover:bg-muted">
                    <input type="file" accept=".csv" onChange={handleCsvUpload} className="hidden" />
                    Upload CSV
                  </label>
                </div>

                {csvParseError ? (
                  <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                    {csvParseError}
                  </div>
                ) : null}

                {batchItems.length > 0 ? (
                  <div className="overflow-hidden rounded-xl border border-border">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="px-4 py-3 font-semibold">#</th>
                          <th className="px-4 py-3 font-semibold">Owner Address</th>
                          <th className="px-4 py-3 font-semibold">Name</th>
                          <th className="px-4 py-3 font-semibold">Image</th>
                          <th className="px-4 py-3 font-semibold">Attributes</th>
                          <th className="px-4 py-3 font-semibold">Row Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {batchItems.map((item, index) => (
                          <tr key={`${item.ownerAddress}-${index}`} className="border-t">
                            <td className="px-4 py-3">{index + 1}</td>
                            <td className="px-4 py-3">{item.ownerAddress || 'N/A'}</td>
                            <td className="px-4 py-3">{item.name || 'N/A'}</td>
                            <td className="px-4 py-3">{item.image ? 'Yes' : 'No'}</td>
                            <td className="px-4 py-3">{Array.isArray(item.attributes) ? item.attributes.length : 0}</td>
                            <td className="px-4 py-3">{item._error ?? 'Ready'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : null}
              </div>
            ) : null}

            {batchMode === 'manual' ? (
              <div className="space-y-4">
                {batchItems.map((item, index) => (
                  <div key={`manual-item-${index}`} className="space-y-4 rounded-xl border border-border p-4">
                    <div className="flex items-center justify-between">
                      <strong className="text-sm">Item {index + 1}</strong>
                      <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveItem(index)}>
                        Remove
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField label="Owner address">
                        <Input
                          value={item.ownerAddress}
                          onChange={(e) => handleUpdateItem(index, 'ownerAddress', e.target.value)}
                          required
                        />
                      </FormField>
                      <FormField label="Name">
                        <Input value={item.name} onChange={(e) => handleUpdateItem(index, 'name', e.target.value)} required />
                      </FormField>
                      <FormField label="Image URL">
                        <Input value={item.image} onChange={(e) => handleUpdateItem(index, 'image', e.target.value)} required />
                      </FormField>
                      <FormField label="Description">
                        <Input
                          value={item.description}
                          onChange={(e) => handleUpdateItem(index, 'description', e.target.value)}
                          required
                        />
                      </FormField>
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={handleAddManualItem}>
                  Add Item
                </Button>
              </div>
            ) : null}

            {batchMode === 'json' ? (
              <FormField label="Raw items JSON array">
                <Textarea
                  className="font-mono text-xs leading-relaxed"
                  rows={18}
                  value={batchRawJson}
                  onChange={(e) => setBatchRawJson(e.target.value)}
                  required
                />
              </FormField>
            ) : null}

            <div className="flex flex-col gap-4 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm text-muted-foreground">
                Total items:{' '}
                <strong className="text-foreground">{batchMode === 'json' ? 'Parsed on submit' : batchItems.length}</strong>
              </span>
              <Button type="submit" disabled={batchMintState.loading}>
                {batchMintState.loading ? 'Submitting...' : 'Submit Batch Mint'}
              </Button>
            </div>
          </form>

          <ResultPanel title="Batch mint response" state={batchMintState} emptyMessage="Results will render here." />
        </SurfaceCard>
      ) : null}

      {activeTab === 'single' ? (
        <SurfaceCard title="Single mint" description="Mint one NFT to a single owner address.">
          <form className="space-y-8" onSubmit={handleSingleMint}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField label="Collection address">
                <Input
                  value={singleMintForm.collectionAddress}
                  onChange={(e) => setSingleMintForm((current) => ({ ...current, collectionAddress: e.target.value }))}
                  required
                />
              </FormField>
              <FormField label="Request ID">
                <Input
                  value={singleMintForm.requestId}
                  onChange={(e) => setSingleMintForm((current) => ({ ...current, requestId: e.target.value }))}
                  required
                />
              </FormField>
              <FormField label="Owner address">
                <Input
                  value={singleMintForm.ownerAddress}
                  onChange={(e) => setSingleMintForm((current) => ({ ...current, ownerAddress: e.target.value }))}
                  required
                />
              </FormField>
              <FormField label="Name">
                <Input
                  value={singleMintForm.name}
                  onChange={(e) => setSingleMintForm((current) => ({ ...current, name: e.target.value }))}
                  required
                />
              </FormField>
              <FormField label="Image URL">
                <Input
                  value={singleMintForm.image}
                  onChange={(e) => setSingleMintForm((current) => ({ ...current, image: e.target.value }))}
                  required
                />
              </FormField>
              <FormField label="Index" hint="Optional NFT index">
                <Input
                  type="number"
                  value={singleMintForm.index}
                  onChange={(e) => setSingleMintForm((current) => ({ ...current, index: e.target.value }))}
                />
              </FormField>
              <div className="md:col-span-2">
                <FormField label="Description">
                  <Textarea
                    rows={4}
                    value={singleMintForm.description}
                    onChange={(e) => setSingleMintForm((current) => ({ ...current, description: e.target.value }))}
                    required
                  />
                </FormField>
              </div>
              <FormField label="Lottie URL">
                <Input
                  value={singleMintForm.lottie}
                  onChange={(e) => setSingleMintForm((current) => ({ ...current, lottie: e.target.value }))}
                />
              </FormField>
              <FormField label="Content URL">
                <Input
                  value={singleMintForm.contentUrl}
                  onChange={(e) => setSingleMintForm((current) => ({ ...current, contentUrl: e.target.value }))}
                />
              </FormField>
              <FormField label="Attributes JSON">
                <Textarea
                  className="font-mono text-xs"
                  rows={4}
                  value={singleMintForm.attributesJson}
                  onChange={(e) => setSingleMintForm((current) => ({ ...current, attributesJson: e.target.value }))}
                />
              </FormField>
              <FormField label="Buttons JSON">
                <Textarea
                  className="font-mono text-xs"
                  rows={4}
                  value={singleMintForm.buttonsJson}
                  onChange={(e) => setSingleMintForm((current) => ({ ...current, buttonsJson: e.target.value }))}
                />
              </FormField>
            </div>

            <div className="flex justify-end border-t pt-4">
              <Button type="submit" disabled={singleMintState.loading}>
                {singleMintState.loading ? 'Submitting...' : 'Create Single Mint'}
              </Button>
            </div>
          </form>

          <ResultPanel title="Single mint response" state={singleMintState} emptyMessage="Response will render here." />
        </SurfaceCard>
      ) : null}

      {activeTab === 'update' ? (
        <SurfaceCard title="Update NFT metadata" description="Patch metadata on a deployed NFT.">
          <form className="space-y-8" onSubmit={handleUpdateNft}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField label="Collection address">
                <Input
                  value={updateNftForm.collectionAddress}
                  onChange={(e) => setUpdateNftForm((current) => ({ ...current, collectionAddress: e.target.value }))}
                  required
                />
              </FormField>
              <FormField label="NFT address">
                <Input
                  value={updateNftForm.nftAddress}
                  onChange={(e) => setUpdateNftForm((current) => ({ ...current, nftAddress: e.target.value }))}
                  required
                />
              </FormField>
              <FormField label="Name">
                <Input
                  value={updateNftForm.name}
                  onChange={(e) => setUpdateNftForm((current) => ({ ...current, name: e.target.value }))}
                />
              </FormField>
              <FormField label="Image URL">
                <Input
                  value={updateNftForm.image}
                  onChange={(e) => setUpdateNftForm((current) => ({ ...current, image: e.target.value }))}
                />
              </FormField>
              <div className="md:col-span-2">
                <FormField label="Description">
                  <Textarea
                    rows={4}
                    value={updateNftForm.description}
                    onChange={(e) => setUpdateNftForm((current) => ({ ...current, description: e.target.value }))}
                  />
                </FormField>
              </div>
              <FormField label="Attributes JSON">
                <Textarea
                  className="font-mono text-xs"
                  rows={4}
                  value={updateNftForm.attributesJson}
                  onChange={(e) => setUpdateNftForm((current) => ({ ...current, attributesJson: e.target.value }))}
                />
              </FormField>
              <FormField label="Upsert attributes JSON">
                <Textarea
                  className="font-mono text-xs"
                  rows={4}
                  value={updateNftForm.upsertAttributesJson}
                  onChange={(e) =>
                    setUpdateNftForm((current) => ({ ...current, upsertAttributesJson: e.target.value }))
                  }
                />
              </FormField>
              <div className="md:col-span-2">
                <FormField label="Buttons JSON">
                  <Textarea
                    className="font-mono text-xs"
                    rows={4}
                    value={updateNftForm.buttonsJson}
                    onChange={(e) => setUpdateNftForm((current) => ({ ...current, buttonsJson: e.target.value }))}
                  />
                </FormField>
              </div>
            </div>

            <div className="flex justify-end border-t pt-4">
              <Button type="submit" disabled={updateNftState.loading}>
                {updateNftState.loading ? 'Updating...' : 'Update NFT'}
              </Button>
            </div>
          </form>

          <ResultPanel title="Update result" state={updateNftState} emptyMessage="Result will render here." />
        </SurfaceCard>
      ) : null}

      {activeTab === 'check' ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <SurfaceCard title="Check mint status" description="Look up a single request ID.">
            <form className="space-y-6" onSubmit={handleStatusLookup}>
              <FormField label="Collection address">
                <Input
                  value={statusForm.collectionAddress}
                  onChange={(e) => setStatusForm((current) => ({ ...current, collectionAddress: e.target.value }))}
                  required
                />
              </FormField>
              <FormField label="Request ID">
                <Input
                  value={statusForm.requestId}
                  onChange={(e) => setStatusForm((current) => ({ ...current, requestId: e.target.value }))}
                  required
                />
              </FormField>
              <div className="flex justify-end border-t pt-4">
                <Button type="submit" variant="secondary" disabled={statusState.loading}>
                  {statusState.loading ? 'Checking...' : 'Check Status'}
                </Button>
              </div>
            </form>

            <ResultPanel title="Status" state={statusState} emptyMessage="Result will render here." />
          </SurfaceCard>

          <SurfaceCard title="Task list" description="Read the queue for the current collection.">
            <form className="space-y-6" onSubmit={handleTaskLookup}>
              <FormField label="Collection address">
                <Input
                  value={tasksForm.collectionAddress}
                  onChange={(e) => setTasksForm((current) => ({ ...current, collectionAddress: e.target.value }))}
                  required
                />
              </FormField>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <FormField label="Limit">
                  <Input
                    type="number"
                    value={tasksForm.limit}
                    onChange={(e) => setTasksForm((current) => ({ ...current, limit: e.target.value }))}
                  />
                </FormField>
                <FormField label="After cursor">
                  <Input
                    value={tasksForm.after}
                    onChange={(e) => setTasksForm((current) => ({ ...current, after: e.target.value }))}
                  />
                </FormField>
                <FormField label="Sort order">
                  <select
                    className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
                    value={tasksForm.reverse ? 'true' : 'false'}
                    onChange={(e) => setTasksForm((current) => ({ ...current, reverse: e.target.value === 'true' }))}
                  >
                    <option value="false">Oldest first</option>
                    <option value="true">Newest first</option>
                  </select>
                </FormField>
              </div>
              <div className="flex justify-end border-t pt-4">
                <Button type="submit" variant="secondary" disabled={tasksState.loading}>
                  {tasksState.loading ? 'Loading...' : 'Load Tasks'}
                </Button>
              </div>
            </form>

            <ResultPanel title="Queue" state={tasksState} emptyMessage="Task list will render here." />
          </SurfaceCard>
        </div>
      ) : null}
    </div>
  );
}

function toOptionalString(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function parseJsonArray(value: string, label: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return undefined;
  }

  const parsed = JSON.parse(trimmed) as unknown;

  if (!Array.isArray(parsed)) {
    throw new Error(`${label} must be a JSON array.`);
  }

  return parsed;
}

function compactObject<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => {
      if (Array.isArray(entry)) {
        return entry.length > 0;
      }

      return entry !== undefined;
    }),
  ) as T;
}

function getErrorMessage(error: unknown) {
  if (error instanceof SyntaxError) {
    return 'Invalid JSON structure detected.';
  }

  return error instanceof Error ? error.message : 'Unexpected request failure.';
}
