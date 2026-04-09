export type GetgemsApiResponse<T> = {
  success: boolean;
  response: T;
};

export type GetgemsMintingStatus =
  | 'just_created'
  | 'in_queue'
  | 'minting'
  | 'ready'
  | 'problem';

export type GetgemsUpdateStatus =
  | 'just_created'
  | 'in_queue'
  | 'updating'
  | 'ready'
  | 'problem';

export type GetgemsMintingStatusObject = {
  status: GetgemsMintingStatus;
  index: number;
  address: string;
  ownerAddress: string;
  url: string;
};

export type GetgemsCollectionCreatingStatus = {
  status: 'in_queue' | 'minting' | 'ready' | 'problem';
  address: string;
};

export type GetgemsMintingListItem = {
  type: 'mintNft' | 'updateNft' | 'addCollection' | 'updateCollection';
  status: 'in_queue' | 'ready' | 'problem';
  requestId: string;
  address: string;
};

export type GetgemsUploadCredentials = {
  uploadUrl: string;
  keyPrefix: string;
  urlPrefix: string;
  formFields: Array<{
    name: string;
    value: string;
  }>;
};

export type GetgemsWalletBalance = {
  balance: string;
};

export type GetgemsUpdateResponse = {
  status: GetgemsUpdateStatus;
  address: string;
  createdAt?: string;
};

export type GetgemsMessageResponse = {
  message: string;
};

