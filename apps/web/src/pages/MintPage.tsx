import { useState, type FormEvent, type ChangeEvent } from 'react';

import { FormField, PageHero, ResultPanel, SurfaceCard, type OperationState } from '../components/ui';
import {
  createBatchMintV2,
  createSingleMint,
  getMintStatus,
  getMintTasks,
  updateNftMetadata,
  type GetgemsNetwork,
} from '../lib/api';
import type { AsyncState } from '../App';
import {
  downloadCsv,
  generateCsvTemplate,
  parseCsvFile,
  type BatchMintItem,
} from '../lib/csv';

type MintPageProps = {
  network: GetgemsNetwork;
  health: AsyncState;
};

const emptyOperationState = (): OperationState => ({
  loading: false,
  error: null,
  result: null,
});

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

  // Batch Mint State
  type BatchMode = 'csv' | 'manual' | 'json';
  const [batchMode, setBatchMode] = useState<BatchMode>('csv');
  const [batchCollectionAddress, setBatchCollectionAddress] = useState(defaultCollectionAddress);
  const [batchRequestId, setBatchRequestId] = useState(String(Date.now() + 1));
  const [batchItems, setBatchItems] = useState<BatchMintItem[]>([]);
  const [batchRawJson, setBatchRawJson] = useState('[\n  \n]');
  const [csvParseError, setCsvParseError] = useState<string | null>(null);

  // Sync defaults
  if (defaultCollectionAddress && !singleMintForm.collectionAddress) {
    setSingleMintForm((c) => ({ ...c, collectionAddress: defaultCollectionAddress }));
    setStatusForm((c) => ({ ...c, collectionAddress: defaultCollectionAddress }));
    setTasksForm((c) => ({ ...c, collectionAddress: defaultCollectionAddress }));
    setUpdateNftForm((c) => ({ ...c, collectionAddress: defaultCollectionAddress }));
    setBatchCollectionAddress(defaultCollectionAddress);
  }

  // ── Single Mint ──

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

  // ── Batch Mint ──

  function handleDownloadTemplate() {
    downloadCsv(generateCsvTemplate(), 'getgems_batch_mint_template.csv');
  }

  async function handleCsvUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setCsvParseError(null);
    try {
      const result = await parseCsvFile(file);
      if (result.errors.length > 0) {
        setCsvParseError(`Found ${result.errors.length} errors. Please check the rows highlighted in red.`);
      }
      // Populate items regardless of errors so user can see them
      setBatchItems(result.items);
      
      // Clear the input so same file can be uploaded again
      event.target.value = '';
    } catch (error) {
      setCsvParseError(getErrorMessage(error));
    }
  }

  function handleBatchModeChange(mode: BatchMode) {
    if (mode === 'json' && batchMode !== 'json') {
      try {
        setBatchRawJson(JSON.stringify(batchItems, null, 2));
      } catch (e) {
        // ignore
      }
    } else if (batchMode === 'json' && mode !== 'json') {
      try {
        const parsed = JSON.parse(batchRawJson);
        if (Array.isArray(parsed)) {
          setBatchItems(parsed as BatchMintItem[]);
        }
      } catch (e) {
        // ignore, keep current items
      }
    }
    setBatchMode(mode);
  }

  function handleAddManualItem() {
    setBatchItems([
      ...batchItems,
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
    setBatchItems(batchItems.filter((_, i) => i !== index));
  }

  function handleUpdateItem(index: number, field: keyof BatchMintItem, value: any) {
    const newItems = [...batchItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setBatchItems(newItems);
  }

  async function handleBatchMint(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBatchMintState({ loading: true, error: null, result: null });

    let finalItems: any[];
    if (batchMode === 'json') {
      try {
        finalItems = parseJsonArray(batchRawJson, 'Batch items JSON') || [];
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
        error: `Batch Mint API requires 1 to 100 items. Currently have ${finalItems.length}.`,
        result: null,
      });
      return;
    }

    try {
      // V2 batch takes just { items: [...] } with per-item requestId (which could be the same as top-level if needed, but we don't have per-item here)
      // Usually the backend maps to V2 requests. We will map to V2 payload if necessary.
      const payloadItems = finalItems.map((item, index) => ({
        ...item,
        requestId: `${batchRequestId}-${index}`,
      }));

      const result = await createBatchMintV2(
        batchCollectionAddress,
        { items: payloadItems },
        network,
      );
      setBatchMintState({ loading: false, error: null, result });
    } catch (error) {
      setBatchMintState({ loading: false, error: getErrorMessage(error), result: null });
    }
  }

  // ── Status and Update ──

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
    <div className="page-stack">
      <PageHero
        eyebrow="Mint execution"
        title="Operate single mint, batch mint, and monitoring workflows from one page."
        description="Submit mints directly to designated owner addresses, inspect request state, and patch NFT metadata on the active network."
      />

      {/* Single Mint */}
      <SurfaceCard title="Single mint" description="Mint one NFT to a specific owner address.">
        <form className="operation-form" onSubmit={handleSingleMint}>
          <div className="form-grid form-grid-two">
            <FormField label="Collection address">
              <input
                className="text-input"
                value={singleMintForm.collectionAddress}
                onChange={(e) => setSingleMintForm((c) => ({ ...c, collectionAddress: e.target.value }))}
                required
              />
            </FormField>
            <FormField label="Request ID">
              <input
                className="text-input"
                value={singleMintForm.requestId}
                onChange={(e) => setSingleMintForm((c) => ({ ...c, requestId: e.target.value }))}
                required
              />
            </FormField>
            <FormField label="Owner address" hint="The TON address to receive this NFT">
              <input
                className="text-input"
                style={{ borderColor: 'var(--color-blue)' }}
                value={singleMintForm.ownerAddress}
                onChange={(e) => setSingleMintForm((c) => ({ ...c, ownerAddress: e.target.value }))}
                placeholder="UQ..."
                required
              />
            </FormField>
            <FormField label="Name">
              <input
                className="text-input"
                value={singleMintForm.name}
                onChange={(e) => setSingleMintForm((c) => ({ ...c, name: e.target.value }))}
                required
              />
            </FormField>
            <FormField label="Description">
              <textarea
                className="text-area"
                value={singleMintForm.description}
                onChange={(e) => setSingleMintForm((c) => ({ ...c, description: e.target.value }))}
                rows={4}
                required
              />
            </FormField>
            <FormField label="Image URL">
              <input
                className="text-input"
                value={singleMintForm.image}
                onChange={(e) => setSingleMintForm((c) => ({ ...c, image: e.target.value }))}
                required
              />
            </FormField>
            <FormField label="Attributes JSON" hint='Example: [{"trait_type":"Tier","value":"Gold"}]'>
              <textarea
                className="text-area"
                value={singleMintForm.attributesJson}
                onChange={(e) => setSingleMintForm((c) => ({ ...c, attributesJson: e.target.value }))}
                rows={4}
              />
            </FormField>
          </div>
          <div className="form-actions">
            <button className="cta cta-primary" type="submit" disabled={singleMintState.loading}>
              {singleMintState.loading ? 'Submitting...' : 'Create single mint'}
            </button>
          </div>
        </form>
        <ResultPanel title="Single mint response" state={singleMintState} emptyMessage="Response will render here." />
      </SurfaceCard>

      {/* Batch Mint (3 modes) */}
      <SurfaceCard
        title="Batch mint"
        description="Mint up to 100 NFTs simultaneously, routing each item to a specific user's ownerAddress."
      >
        <form className="operation-form" onSubmit={handleBatchMint}>
          <div className="form-grid">
            <FormField label="Collection address">
              <input
                className="text-input"
                value={batchCollectionAddress}
                onChange={(e) => setBatchCollectionAddress(e.target.value)}
                required
              />
            </FormField>
            <FormField label="Base Request ID">
              <input
                className="text-input"
                value={batchRequestId}
                onChange={(e) => setBatchRequestId(e.target.value)}
                required
              />
            </FormField>
          </div>

          <div className="batch-tabs">
            <button
              type="button"
              className={`batch-tab ${batchMode === 'csv' ? 'active' : ''}`}
              onClick={() => handleBatchModeChange('csv')}
            >
              📄 CSV Upload
            </button>
            <button
              type="button"
              className={`batch-tab ${batchMode === 'manual' ? 'active' : ''}`}
              onClick={() => handleBatchModeChange('manual')}
            >
              ✏️ Manual Build
            </button>
            <button
              type="button"
              className={`batch-tab ${batchMode === 'json' ? 'active' : ''}`}
              onClick={() => handleBatchModeChange('json')}
            >
              {} Raw JSON
            </button>
          </div>

          {batchMode === 'csv' && (
            <div>
              <div style={{ marginBottom: '16px' }}>
                <button type="button" className="inline-button" onClick={handleDownloadTemplate}>
                  📥 Download CSV Template
                </button>
              </div>

              <label className="csv-dropzone">
                <input type="file" accept=".csv" onChange={handleCsvUpload} style={{ display: 'none' }} />
                <p>Click here to browse or drag & drop CSV</p>
                <span>Columns: ownerAddress, name, description, image, attributes</span>
              </label>

              {csvParseError && <div className="result-error" style={{ marginBottom: '16px' }}>{csvParseError}</div>}

              {batchItems.length > 0 && (
                <div>
                  <h4 style={{ margin: '0 0 12px' }}>CSV Preview ({batchItems.length} items)</h4>
                  <div style={{ overflowX: 'auto' }}>
                    <table className="preview-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Owner Address</th>
                          <th>Name</th>
                          <th>Has Image</th>
                          <th>Attrs</th>
                        </tr>
                      </thead>
                      <tbody>
                        {batchItems.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.ownerAddress.slice(0, 10)}...</td>
                            <td>{item.name}</td>
                            <td>{item.image ? '✅' : '❌'}</td>
                            <td>{Array.isArray(item.attributes) ? item.attributes.length : 'ERR'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {batchMode === 'manual' && (
            <div>
              {batchItems.map((item, index) => (
                <div key={index} className="item-card">
                  <div className="item-card-header">
                    <h4>Item #{index + 1}</h4>
                    <button type="button" className="inline-button" style={{ color: '#c00' }} onClick={() => handleRemoveItem(index)}>
                      🗑 Remove
                    </button>
                  </div>
                  <div className="form-grid form-grid-two">
                    <FormField label="Owner Address" hint="Must be provided per-item.">
                      <input
                        className="text-input"
                        value={item.ownerAddress}
                        onChange={(e) => handleUpdateItem(index, 'ownerAddress', e.target.value)}
                        required
                      />
                    </FormField>
                    <FormField label="Name">
                      <input
                        className="text-input"
                        value={item.name}
                        onChange={(e) => handleUpdateItem(index, 'name', e.target.value)}
                        required
                      />
                    </FormField>
                    <FormField label="Image URL">
                      <input
                        className="text-input"
                        value={item.image}
                        onChange={(e) => handleUpdateItem(index, 'image', e.target.value)}
                        required
                      />
                    </FormField>
                    <FormField label="Description">
                      <input
                        className="text-input"
                        value={item.description}
                        onChange={(e) => handleUpdateItem(index, 'description', e.target.value)}
                        required
                      />
                    </FormField>
                  </div>
                </div>
              ))}
              <button type="button" className="cta cta-dark" style={{ marginTop: '16px' }} onClick={handleAddManualItem}>
                + Add Item
              </button>
            </div>
          )}

          {batchMode === 'json' && (
            <FormField label="Raw Items JSON Array">
              <textarea
                className="text-area text-area-large"
                rows={16}
                value={batchRawJson}
                onChange={(e) => setBatchRawJson(e.target.value)}
                required
              />
            </FormField>
          )}

          <div className="batch-status">
            <span>
              <strong>Total items to mint: </strong>
              {batchMode === 'json' ? 'Parsed on submit' : batchItems.length}
            </span>
            <button className="cta cta-primary" type="submit" disabled={batchMintState.loading}>
              {batchMintState.loading ? 'Submitting...' : 'Submit Batch Mint'}
            </button>
          </div>
        </form>

        <ResultPanel title="Batch mint response" state={batchMintState} emptyMessage="Results will render here." />
      </SurfaceCard>

      {/* Monitoring & Updates */}
      <div className="content-grid content-grid-two">
        <SurfaceCard title="Check status" description="Look up the state of a single mint request.">
          <form className="operation-form" onSubmit={handleStatusLookup}>
            <div className="form-grid">
              <FormField label="Collection address">
                <input
                  className="text-input"
                  value={statusForm.collectionAddress}
                  onChange={(e) => setStatusForm((c) => ({ ...c, collectionAddress: e.target.value }))}
                  required
                />
              </FormField>
              <FormField label="Request ID">
                <input
                  className="text-input"
                  value={statusForm.requestId}
                  onChange={(e) => setStatusForm((c) => ({ ...c, requestId: e.target.value }))}
                  required
                />
              </FormField>
            </div>
            <div className="form-actions">
              <button className="cta cta-dark" type="submit" disabled={statusState.loading}>
                {statusState.loading ? 'Checking...' : 'Check Status'}
              </button>
            </div>
          </form>
          <ResultPanel title="Status" state={statusState} emptyMessage="Result renders here." />
        </SurfaceCard>

        <SurfaceCard title="Task list" description="Read the queue.">
          <form className="operation-form" onSubmit={handleTaskLookup}>
            <div className="form-grid">
              <FormField label="Collection address">
                <input
                  className="text-input"
                  value={tasksForm.collectionAddress}
                  onChange={(e) => setTasksForm((c) => ({ ...c, collectionAddress: e.target.value }))}
                  required
                />
              </FormField>
              <FormField label="Limit">
                <input
                  className="text-input"
                  type="number"
                  value={tasksForm.limit}
                  onChange={(e) => setTasksForm((c) => ({ ...c, limit: e.target.value }))}
                />
              </FormField>
              <FormField label="Reverse Sort">
                <select
                  className="text-input"
                  value={tasksForm.reverse ? 'true' : 'false'}
                  onChange={(e) => setTasksForm((c) => ({ ...c, reverse: e.target.value === 'true' }))}
                >
                  <option value="false">Oldest first</option>
                  <option value="true">Newest first</option>
                </select>
              </FormField>
            </div>
            <div className="form-actions">
              <button className="cta cta-dark" type="submit" disabled={tasksState.loading}>
                {tasksState.loading ? 'Loading...' : 'Load Tasks'}
              </button>
            </div>
          </form>
          <ResultPanel title="Queue" state={tasksState} emptyMessage="Tasks render here." />
        </SurfaceCard>
      </div>

      <SurfaceCard title="Update NFT metadata" description="Patch deployed NFT metadata traits or links.">
        <form className="operation-form" onSubmit={handleUpdateNft}>
          <div className="form-grid form-grid-two">
            <FormField label="Collection address">
              <input
                className="text-input"
                value={updateNftForm.collectionAddress}
                onChange={(e) => setUpdateNftForm((c) => ({ ...c, collectionAddress: e.target.value }))}
                required
              />
            </FormField>
            <FormField label="NFT Address">
              <input
                className="text-input"
                value={updateNftForm.nftAddress}
                onChange={(e) => setUpdateNftForm((c) => ({ ...c, nftAddress: e.target.value }))}
                required
              />
            </FormField>
            <FormField label="Name">
              <input
                className="text-input"
                value={updateNftForm.name}
                onChange={(e) => setUpdateNftForm((c) => ({ ...c, name: e.target.value }))}
              />
            </FormField>
            <FormField label="Image URL">
              <input
                className="text-input"
                value={updateNftForm.image}
                onChange={(e) => setUpdateNftForm((c) => ({ ...c, image: e.target.value }))}
              />
            </FormField>
            <FormField label="Attributes JSON">
              <textarea
                className="text-area"
                value={updateNftForm.attributesJson}
                onChange={(e) => setUpdateNftForm((c) => ({ ...c, attributesJson: e.target.value }))}
                rows={3}
              />
            </FormField>
            <FormField label="Upsert Attributes JSON">
              <textarea
                className="text-area"
                value={updateNftForm.upsertAttributesJson}
                onChange={(e) => setUpdateNftForm((c) => ({ ...c, upsertAttributesJson: e.target.value }))}
                rows={3}
              />
            </FormField>
          </div>
          <div className="form-actions">
            <button className="cta cta-primary" type="submit" disabled={updateNftState.loading}>
              {updateNftState.loading ? 'Updating...' : 'Update NFT'}
            </button>
          </div>
        </form>
        <ResultPanel title="Update Result" state={updateNftState} emptyMessage="Result here." />
      </SurfaceCard>
    </div>
  );
}

function toOptionalString(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function parseJsonArray(value: string, label: string) {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const parsed = JSON.parse(trimmed) as unknown;
  if (!Array.isArray(parsed)) throw new Error(`${label} must be a JSON array.`);
  return parsed;
}

function compactObject<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => {
      if (Array.isArray(entry)) return entry.length > 0;
      return entry !== undefined;
    }),
  ) as T;
}

function getErrorMessage(error: unknown) {
  if (error instanceof SyntaxError) return 'Invalid JSON structure detected.';
  return error instanceof Error ? error.message : 'Unexpected request failure.';
}
