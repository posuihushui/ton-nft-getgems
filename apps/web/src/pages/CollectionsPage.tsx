import { useEffect, useState, type FormEvent } from 'react';

import { FormField, PageHero, ResultPanel, SectionIntro, SurfaceCard, type OperationState } from '@/components/ui';
import {
  createCollectionFromTemplate,
  createUploadCredentials,
  updateCollectionMetadata,
  getCollectionCreationStatus,
  type GetgemsNetwork,
} from '@/lib/api';

import type { AsyncState } from '@/App';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

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

  useEffect(() => {
    if (!defaultCollectionAddress) {
      return;
    }

    setCreateForm((current) =>
      current.templateCollectionAddress ? current : { ...current, templateCollectionAddress: defaultCollectionAddress },
    );
    setStatusForm((current) =>
      current.templateCollectionAddress ? current : { ...current, templateCollectionAddress: defaultCollectionAddress },
    );
    setUploadForm((current) =>
      current.collectionAddress ? current : { ...current, collectionAddress: defaultCollectionAddress },
    );
    setUpdateForm((current) =>
      current.collectionAddress ? current : { ...current, collectionAddress: defaultCollectionAddress },
    );
  }, [defaultCollectionAddress]);

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
    <div className="flex flex-col gap-12 pb-8">
      <PageHero
        eyebrow="Collections"
        title="Create and maintain collection state without leaving the control surface."
        description="Use the collection tools to submit creation requests, check progress, request upload credentials, and update metadata on the currently selected network."
        actions={
          <Button asChild>
            <a
              href="https://github.com/getgems-io/nft-contracts/blob/main/docs/minting-api-en.md"
              target="_blank"
              rel="noreferrer"
            >
              Review minting guide
            </a>
          </Button>
        }
      />

      <SectionIntro
        eyebrow="Collection operations"
        title="Everything needed before the first mint."
        description="Collection creation on Getgems still deserves testnet validation first, so this page keeps creation, lookup, upload, and metadata maintenance close together."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <SurfaceCard
          title="Create collection"
          description="Submit a new collection creation request using a template collection context and the currently selected network."
        >
          <form className="space-y-8" onSubmit={handleCreateCollection}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Template collection address" hint="Used as route context">
                <Input
                  value={createForm.templateCollectionAddress}
                  onChange={(event) =>
                    setCreateForm((current) => ({ ...current, templateCollectionAddress: event.target.value }))
                  }
                  placeholder="EQ..."
                  required
                />
              </FormField>
              <FormField label="Request ID">
                <Input
                  value={createForm.requestId}
                  onChange={(event) => setCreateForm((current) => ({ ...current, requestId: event.target.value }))}
                  required
                />
              </FormField>
              <FormField label="Owner address">
                <Input
                  value={createForm.ownerAddress}
                  onChange={(event) => setCreateForm((current) => ({ ...current, ownerAddress: event.target.value }))}
                  placeholder="UQ..."
                  required
                />
              </FormField>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Royalty %">
                  <Input
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
                  <Input
                    value={createForm.royaltyAddress}
                    onChange={(event) =>
                      setCreateForm((current) => ({ ...current, royaltyAddress: event.target.value }))
                    }
                    placeholder="UQ..."
                    required
                  />
                </FormField>
              </div>
              <div className="md:col-span-2">
                <FormField label="Collection name">
                  <Input
                    value={createForm.name}
                    onChange={(event) => setCreateForm((current) => ({ ...current, name: event.target.value }))}
                    required
                  />
                </FormField>
              </div>
              <div className="md:col-span-2">
                <FormField label="Description" hint="Up to 1000 characters.">
                  <Textarea
                    value={createForm.description}
                    onChange={(event) =>
                      setCreateForm((current) => ({ ...current, description: event.target.value }))
                    }
                    rows={4}
                    required
                  />
                </FormField>
              </div>
              <FormField label="Image URL">
                <Input
                  value={createForm.image}
                  onChange={(event) => setCreateForm((current) => ({ ...current, image: event.target.value }))}
                  placeholder="https://..."
                />
              </FormField>
              <FormField label="External link">
                <Input
                  value={createForm.externalLink}
                  onChange={(event) =>
                    setCreateForm((current) => ({ ...current, externalLink: event.target.value }))
                  }
                  placeholder="https://..."
                />
              </FormField>
              <FormField label="Cover image URL">
                <Input
                  value={createForm.coverImage}
                  onChange={(event) => setCreateForm((current) => ({ ...current, coverImage: event.target.value }))}
                  placeholder="https://..."
                />
              </FormField>
              <FormField label="Social links" hint="Comma or newline separated">
                <Textarea
                  value={createForm.socialLinks}
                  onChange={(event) =>
                    setCreateForm((current) => ({ ...current, socialLinks: event.target.value }))
                  }
                  rows={4}
                  placeholder="https://x.com/project&#10;https://t.me/project"
                />
              </FormField>
            </div>

            <div className="flex justify-end border-t border-black/6 pt-4">
              <Button type="submit" disabled={createState.loading} className="px-8 h-11">
                {createState.loading ? 'Creating...' : 'Create collection'}
              </Button>
            </div>
          </form>

          <ResultPanel
            title="Collection creation response"
            state={createState}
            emptyMessage="Submit a creation request to see response."
          />
        </SurfaceCard>

        <SurfaceCard
          title="Check status"
          description="Look up status of a collection creation request."
        >
          <form className="space-y-6" onSubmit={handleGetCollectionStatus}>
            <div className="space-y-4">
              <FormField label="Template collection address">
                <Input
                  value={statusForm.templateCollectionAddress}
                  onChange={(event) =>
                    setStatusForm((current) => ({ ...current, templateCollectionAddress: event.target.value }))
                  }
                  placeholder="EQ..."
                  required
                />
              </FormField>
              <FormField label="Request ID">
                <Input
                  value={statusForm.requestId}
                  onChange={(event) => setStatusForm((current) => ({ ...current, requestId: event.target.value }))}
                  required
                />
              </FormField>
            </div>

            <div className="flex justify-end border-t border-black/6 pt-4">
              <Button type="submit" variant="secondary" disabled={statusState.loading} className="w-full sm:w-auto">
                {statusState.loading ? 'Checking...' : 'Check status'}
              </Button>
            </div>
          </form>

          <ResultPanel
            title="Collection status"
            state={statusState}
            emptyMessage="Status will appear here."
          />
        </SurfaceCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <SurfaceCard
          title="Create upload credentials"
          description="Request temporary upload credentials for a file."
        >
          <form className="space-y-6" onSubmit={handleCreateUploadCredentials}>
            <div className="space-y-4">
              <FormField label="Collection address">
                <Input
                  value={uploadForm.collectionAddress}
                  onChange={(event) =>
                    setUploadForm((current) => ({ ...current, collectionAddress: event.target.value }))
                  }
                  placeholder="EQ..."
                  required
                />
              </FormField>
              <FormField label="File name" hint="e.g. cover.png or metadata.json">
                <Input
                  value={uploadForm.fileName}
                  onChange={(event) => setUploadForm((current) => ({ ...current, fileName: event.target.value }))}
                  required
                />
              </FormField>
            </div>

            <div className="flex justify-end border-t border-black/6 pt-4">
              <Button type="submit" variant="secondary" disabled={uploadState.loading} className="w-full sm:w-auto">
                {uploadState.loading ? 'Requesting...' : 'Request credentials'}
              </Button>
            </div>
          </form>

          <ResultPanel
            title="Upload credentials"
            state={uploadState}
            emptyMessage="Credentials will appear here."
          />
        </SurfaceCard>

        <SurfaceCard
          title="Update metadata"
          description="Patch collection metadata and royalty settings."
        >
          <form className="space-y-8" onSubmit={handleUpdateCollection}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Collection address">
                <Input
                  value={updateForm.collectionAddress}
                  onChange={(event) =>
                    setUpdateForm((current) => ({ ...current, collectionAddress: event.target.value }))
                  }
                  placeholder="EQ..."
                  required
                />
              </FormField>
              <FormField label="Request ID">
                <Input
                  value={updateForm.requestId}
                  onChange={(event) => setUpdateForm((current) => ({ ...current, requestId: event.target.value }))}
                />
              </FormField>
              <FormField label="Name">
                <Input
                  value={updateForm.name}
                  onChange={(event) => setUpdateForm((current) => ({ ...current, name: event.target.value }))}
                />
              </FormField>
              <FormField label="Royalty %">
                <Input
                  type="number"
                  min="0"
                  max="49"
                  value={updateForm.royaltyPercent}
                  onChange={(event) =>
                    setUpdateForm((current) => ({ ...current, royaltyPercent: event.target.value }))
                  }
                />
              </FormField>
              <div className="md:col-span-2">
                <FormField label="Description">
                  <Textarea
                    value={updateForm.description}
                    onChange={(event) =>
                      setUpdateForm((current) => ({ ...current, description: event.target.value }))
                    }
                    rows={4}
                  />
                </FormField>
              </div>
              <FormField label="Royalty address">
                <Input
                  value={updateForm.royaltyAddress}
                  onChange={(event) =>
                    setUpdateForm((current) => ({ ...current, royaltyAddress: event.target.value }))
                  }
                  placeholder="UQ..."
                />
              </FormField>
              <FormField label="Image URL">
                <Input
                  value={updateForm.image}
                  onChange={(event) => setUpdateForm((current) => ({ ...current, image: event.target.value }))}
                  placeholder="https://..."
                />
              </FormField>
              <FormField label="External link">
                <Input
                  value={updateForm.externalLink}
                  onChange={(event) =>
                    setUpdateForm((current) => ({ ...current, externalLink: event.target.value }))
                  }
                  placeholder="https://..."
                />
              </FormField>
              <FormField label="Cover image URL">
                <Input
                  value={updateForm.coverImage}
                  onChange={(event) => setUpdateForm((current) => ({ ...current, coverImage: event.target.value }))}
                  placeholder="https://..."
                />
              </FormField>
              <FormField label="Social links">
                <Textarea
                  value={updateForm.socialLinks}
                  onChange={(event) =>
                    setUpdateForm((current) => ({ ...current, socialLinks: event.target.value }))
                  }
                  rows={4}
                  placeholder="https://x.com/project"
                />
              </FormField>
            </div>

            <div className="flex justify-end border-t border-black/6 pt-4">
              <Button type="submit" disabled={updateState.loading} className="px-8 h-11">
                {updateState.loading ? 'Updating...' : 'Update collection'}
              </Button>
            </div>
          </form>

          <ResultPanel
            title="Update response"
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
