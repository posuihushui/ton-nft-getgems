import { useState, type FormEvent } from 'react';

import { FormField, PageHero, ResultPanel, SectionIntro, SurfaceCard, type OperationState } from '../components/ui';
import {
  createCollectionFromTemplate,
  createUploadCredentials,
  updateCollectionMetadata,
  getCollectionCreationStatus,
  type GetgemsNetwork,
} from '../lib/api';

import type { AsyncState } from '../App';

type CollectionsPageProps = {
  network: GetgemsNetwork;
  health: AsyncState;
};

const emptyOperationState = (): OperationState => ({
  loading: false,
  error: null,
  result: null,
});

export function CollectionsPage({ network, health }: CollectionsPageProps) {
  const defaultCollectionAddress = health.data?.collectionAddress ?? '';

  const [createState, setCreateState] = useState<OperationState>(emptyOperationState);
  const [statusState, setStatusState] = useState<OperationState>(emptyOperationState);
  const [uploadState, setUploadState] = useState<OperationState>(emptyOperationState);
  const [updateState, setUpdateState] = useState<OperationState>(emptyOperationState);

  const [createForm, setCreateForm] = useState({
    templateCollectionAddress: defaultCollectionAddress,
    requestId: String(Date.now()),
    ownerAddress: '',
    royaltyPercent: '5',
    royaltyAddress: '',
    name: '',
    description: '',
    image: '',
    externalLink: '',
    socialLinks: '',
    coverImage: '',
  });

  const [statusForm, setStatusForm] = useState({
    templateCollectionAddress: defaultCollectionAddress,
    requestId: '',
  });

  const [uploadForm, setUploadForm] = useState({
    collectionAddress: defaultCollectionAddress,
    fileName: 'cover.png',
  });

  const [updateForm, setUpdateForm] = useState({
    collectionAddress: defaultCollectionAddress,
    requestId: '',
    name: '',
    description: '',
    image: '',
    externalLink: '',
    socialLinks: '',
    coverImage: '',
    royaltyPercent: '',
    royaltyAddress: '',
  });

  // Sync default address when it arrives from health payload
  if (defaultCollectionAddress && !createForm.templateCollectionAddress) {
    setCreateForm((c) => ({ ...c, templateCollectionAddress: defaultCollectionAddress }));
    setStatusForm((c) => ({ ...c, templateCollectionAddress: defaultCollectionAddress }));
    setUploadForm((c) => ({ ...c, collectionAddress: defaultCollectionAddress }));
    setUpdateForm((c) => ({ ...c, collectionAddress: defaultCollectionAddress }));
  }

  async function handleCreateCollection(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreateState({
      loading: true,
      error: null,
      result: null,
    });

    try {
      const result = await createCollectionFromTemplate(
        createForm.templateCollectionAddress,
        {
          requestId: createForm.requestId,
          ownerAddress: createForm.ownerAddress,
          royaltyPercent: Number(createForm.royaltyPercent),
          royaltyAddress: createForm.royaltyAddress,
          metadata: compactObject({
            name: createForm.name,
            description: createForm.description,
            image: toOptionalString(createForm.image),
            external_link: toOptionalString(createForm.externalLink),
            social_links: toOptionalList(createForm.socialLinks),
            cover_image: toOptionalString(createForm.coverImage),
          }),
        },
        network,
      );

      setCreateState({
        loading: false,
        error: null,
        result,
      });
    } catch (error) {
      setCreateState({
        loading: false,
        error: getErrorMessage(error),
        result: null,
      });
    }
  }

  async function handleGetCollectionStatus(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatusState({
      loading: true,
      error: null,
      result: null,
    });

    try {
      const result = await getCollectionCreationStatus(
        statusForm.templateCollectionAddress,
        statusForm.requestId,
        network,
      );

      setStatusState({
        loading: false,
        error: null,
        result,
      });
    } catch (error) {
      setStatusState({
        loading: false,
        error: getErrorMessage(error),
        result: null,
      });
    }
  }

  async function handleCreateUploadCredentials(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setUploadState({
      loading: true,
      error: null,
      result: null,
    });

    try {
      const result = await createUploadCredentials(uploadForm.collectionAddress, uploadForm.fileName, network);

      setUploadState({
        loading: false,
        error: null,
        result,
      });
    } catch (error) {
      setUploadState({
        loading: false,
        error: getErrorMessage(error),
        result: null,
      });
    }
  }

  async function handleUpdateCollection(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setUpdateState({
      loading: true,
      error: null,
      result: null,
    });

    try {
      const metadata = compactObject({
        name: toOptionalString(updateForm.name),
        description: toOptionalString(updateForm.description),
        image: toOptionalString(updateForm.image),
        external_link: toOptionalString(updateForm.externalLink),
        social_links: toOptionalList(updateForm.socialLinks),
        cover_image: toOptionalString(updateForm.coverImage),
      });

      const result = await updateCollectionMetadata(
        updateForm.collectionAddress,
        compactObject({
          requestId: toOptionalString(updateForm.requestId),
          metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
          royaltyPercent: updateForm.royaltyPercent ? Number(updateForm.royaltyPercent) : undefined,
          royaltyAddress: toOptionalString(updateForm.royaltyAddress),
        }),
        network,
      );

      setUpdateState({
        loading: false,
        error: null,
        result,
      });
    } catch (error) {
      setUpdateState({
        loading: false,
        error: getErrorMessage(error),
        result: null,
      });
    }
  }

  return (
    <div className="page-stack">
      <PageHero
        eyebrow="Collections"
        title="Create and maintain collection state without leaving the control surface."
        description="Use the collection tools to submit creation requests, check progress, request upload credentials, and update metadata on the currently selected network."
        actions={
          <a
            className="cta cta-primary"
            href="https://github.com/getgems-io/nft-contracts/blob/main/docs/minting-api-en.md"
            target="_blank"
            rel="noreferrer"
          >
            Review minting guide
          </a>
        }
      />

      <SectionIntro
        eyebrow="Collection operations"
        title="Everything needed before the first mint."
        description="Collection creation on Getgems still deserves testnet validation first, so this page keeps creation, lookup, upload, and metadata maintenance close together."
      />

      <div className="content-grid content-grid-two">
        <SurfaceCard
          title="Create collection"
          description="Submit a new collection creation request using a template collection context and the currently selected network."
        >
          <form className="operation-form" onSubmit={handleCreateCollection}>
            <div className="form-grid form-grid-two">
              <FormField label="Template collection address" hint="Used as the route context for new-collection.">
                <input
                  className="text-input"
                  value={createForm.templateCollectionAddress}
                  onChange={(event) =>
                    setCreateForm((current) => ({ ...current, templateCollectionAddress: event.target.value }))
                  }
                  placeholder="EQ..."
                  required
                />
              </FormField>
              <FormField label="Request ID">
                <input
                  className="text-input"
                  value={createForm.requestId}
                  onChange={(event) => setCreateForm((current) => ({ ...current, requestId: event.target.value }))}
                  required
                />
              </FormField>
              <FormField label="Owner address">
                <input
                  className="text-input"
                  value={createForm.ownerAddress}
                  onChange={(event) => setCreateForm((current) => ({ ...current, ownerAddress: event.target.value }))}
                  placeholder="UQ..."
                  required
                />
              </FormField>
              <FormField label="Royalty percent">
                <input
                  className="text-input"
                  type="number"
                  min="0"
                  max="49"
                  value={createForm.royaltyPercent}
                  onChange={(event) =>
                    setCreateForm((current) => ({ ...current, royaltyPercent: event.target.value }))
                  }
                  required
                />
              </FormField>
              <FormField label="Royalty address">
                <input
                  className="text-input"
                  value={createForm.royaltyAddress}
                  onChange={(event) =>
                    setCreateForm((current) => ({ ...current, royaltyAddress: event.target.value }))
                  }
                  placeholder="UQ..."
                  required
                />
              </FormField>
              <FormField label="Collection name">
                <input
                  className="text-input"
                  value={createForm.name}
                  onChange={(event) => setCreateForm((current) => ({ ...current, name: event.target.value }))}
                  required
                />
              </FormField>
              <FormField label="Description" hint="Up to 1000 characters." >
                <textarea
                  className="text-area"
                  value={createForm.description}
                  onChange={(event) =>
                    setCreateForm((current) => ({ ...current, description: event.target.value }))
                  }
                  rows={4}
                  required
                />
              </FormField>
              <FormField label="Image URL">
                <input
                  className="text-input"
                  value={createForm.image}
                  onChange={(event) => setCreateForm((current) => ({ ...current, image: event.target.value }))}
                  placeholder="https://..."
                />
              </FormField>
              <FormField label="External link">
                <input
                  className="text-input"
                  value={createForm.externalLink}
                  onChange={(event) =>
                    setCreateForm((current) => ({ ...current, externalLink: event.target.value }))
                  }
                  placeholder="https://..."
                />
              </FormField>
              <FormField label="Cover image URL">
                <input
                  className="text-input"
                  value={createForm.coverImage}
                  onChange={(event) => setCreateForm((current) => ({ ...current, coverImage: event.target.value }))}
                  placeholder="https://..."
                />
              </FormField>
              <FormField label="Social links" hint="One URL per line or comma separated.">
                <textarea
                  className="text-area"
                  value={createForm.socialLinks}
                  onChange={(event) =>
                    setCreateForm((current) => ({ ...current, socialLinks: event.target.value }))
                  }
                  rows={4}
                  placeholder="https://x.com/project&#10;https://t.me/project"
                />
              </FormField>
            </div>

            <div className="form-actions">
              <button className="cta cta-primary" type="submit" disabled={createState.loading}>
                {createState.loading ? 'Creating...' : 'Create collection'}
              </button>
            </div>
          </form>

          <ResultPanel
            title="Collection creation response"
            state={createState}
            emptyMessage="Submit a creation request to see the Getgems response payload here."
          />
        </SurfaceCard>

        <SurfaceCard
          title="Check collection status"
          description="Look up the status of a collection creation request using the same template address and request ID."
        >
          <form className="operation-form" onSubmit={handleGetCollectionStatus}>
            <div className="form-grid">
              <FormField label="Template collection address">
                <input
                  className="text-input"
                  value={statusForm.templateCollectionAddress}
                  onChange={(event) =>
                    setStatusForm((current) => ({ ...current, templateCollectionAddress: event.target.value }))
                  }
                  placeholder="EQ..."
                  required
                />
              </FormField>
              <FormField label="Request ID">
                <input
                  className="text-input"
                  value={statusForm.requestId}
                  onChange={(event) => setStatusForm((current) => ({ ...current, requestId: event.target.value }))}
                  required
                />
              </FormField>
            </div>

            <div className="form-actions">
              <button className="cta cta-dark" type="submit" disabled={statusState.loading}>
                {statusState.loading ? 'Checking...' : 'Check status'}
              </button>
            </div>
          </form>

          <ResultPanel
            title="Collection status"
            state={statusState}
            emptyMessage="Request status will appear here after you submit a lookup."
          />
        </SurfaceCard>
      </div>

      <div className="content-grid content-grid-two">
        <SurfaceCard
          title="Create upload credentials"
          description="Request temporary upload credentials for a file tied to an existing collection."
        >
          <form className="operation-form" onSubmit={handleCreateUploadCredentials}>
            <div className="form-grid">
              <FormField label="Collection address">
                <input
                  className="text-input"
                  value={uploadForm.collectionAddress}
                  onChange={(event) =>
                    setUploadForm((current) => ({ ...current, collectionAddress: event.target.value }))
                  }
                  placeholder="EQ..."
                  required
                />
              </FormField>
              <FormField label="File name" hint="Supports optional extension such as cover.png or metadata.json.">
                <input
                  className="text-input"
                  value={uploadForm.fileName}
                  onChange={(event) => setUploadForm((current) => ({ ...current, fileName: event.target.value }))}
                  required
                />
              </FormField>
            </div>

            <div className="form-actions">
              <button className="cta cta-dark" type="submit" disabled={uploadState.loading}>
                {uploadState.loading ? 'Requesting...' : 'Request credentials'}
              </button>
            </div>
          </form>

          <ResultPanel
            title="Upload credentials"
            state={uploadState}
            emptyMessage="Upload URL, key prefix, and form fields will appear here after the request succeeds."
          />
        </SurfaceCard>

        <SurfaceCard
          title="Update collection metadata"
          description="Patch collection metadata and royalty settings on the currently selected network."
        >
          <form className="operation-form" onSubmit={handleUpdateCollection}>
            <div className="form-grid form-grid-two">
              <FormField label="Collection address">
                <input
                  className="text-input"
                  value={updateForm.collectionAddress}
                  onChange={(event) =>
                    setUpdateForm((current) => ({ ...current, collectionAddress: event.target.value }))
                  }
                  placeholder="EQ..."
                  required
                />
              </FormField>
              <FormField label="Request ID" hint="Optional, but useful for tracking update requests.">
                <input
                  className="text-input"
                  value={updateForm.requestId}
                  onChange={(event) => setUpdateForm((current) => ({ ...current, requestId: event.target.value }))}
                />
              </FormField>
              <FormField label="Name">
                <input
                  className="text-input"
                  value={updateForm.name}
                  onChange={(event) => setUpdateForm((current) => ({ ...current, name: event.target.value }))}
                />
              </FormField>
              <FormField label="Royalty percent">
                <input
                  className="text-input"
                  type="number"
                  min="0"
                  max="49"
                  value={updateForm.royaltyPercent}
                  onChange={(event) =>
                    setUpdateForm((current) => ({ ...current, royaltyPercent: event.target.value }))
                  }
                />
              </FormField>
              <FormField label="Description">
                <textarea
                  className="text-area"
                  value={updateForm.description}
                  onChange={(event) =>
                    setUpdateForm((current) => ({ ...current, description: event.target.value }))
                  }
                  rows={4}
                />
              </FormField>
              <FormField label="Royalty address">
                <input
                  className="text-input"
                  value={updateForm.royaltyAddress}
                  onChange={(event) =>
                    setUpdateForm((current) => ({ ...current, royaltyAddress: event.target.value }))
                  }
                  placeholder="UQ..."
                />
              </FormField>
              <FormField label="Image URL">
                <input
                  className="text-input"
                  value={updateForm.image}
                  onChange={(event) => setUpdateForm((current) => ({ ...current, image: event.target.value }))}
                  placeholder="https://..."
                />
              </FormField>
              <FormField label="External link">
                <input
                  className="text-input"
                  value={updateForm.externalLink}
                  onChange={(event) =>
                    setUpdateForm((current) => ({ ...current, externalLink: event.target.value }))
                  }
                  placeholder="https://..."
                />
              </FormField>
              <FormField label="Cover image URL">
                <input
                  className="text-input"
                  value={updateForm.coverImage}
                  onChange={(event) => setUpdateForm((current) => ({ ...current, coverImage: event.target.value }))}
                  placeholder="https://..."
                />
              </FormField>
              <FormField label="Social links">
                <textarea
                  className="text-area"
                  value={updateForm.socialLinks}
                  onChange={(event) =>
                    setUpdateForm((current) => ({ ...current, socialLinks: event.target.value }))
                  }
                  rows={4}
                  placeholder="https://x.com/project"
                />
              </FormField>
            </div>

            <div className="form-actions">
              <button className="cta cta-primary" type="submit" disabled={updateState.loading}>
                {updateState.loading ? 'Updating...' : 'Update collection'}
              </button>
            </div>
          </form>

          <ResultPanel
            title="Collection update response"
            state={updateState}
            emptyMessage="Updated metadata responses will render here."
          />
        </SurfaceCard>
      </div>
    </div>
  );
}

function toOptionalString(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function toOptionalList(value: string) {
  const items = value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);

  return items.length > 0 ? items : undefined;
}

function compactObject<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== undefined)) as T;
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unexpected request failure.';
}
