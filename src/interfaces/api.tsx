import { FF_EVENTS, MessageStatus, OperationStatus } from './enums';

export interface IBlockchainEvent {
  id: string;
  sequence: number;
  source: string;
  namespace: string;
  name: string;
  protocolId: string;
  output?: any;
  info?: any;
  timestamp: string;
  tx: {
    type: string;
    id: string;
  };
}

export interface IEvent {
  id: string;
  sequence: number;
  type: FF_EVENTS;
  namespace: string;
  reference: string;
  created: string;
  tx: string;
}

export interface IGenericPagedResponse {
  count: number;
  items: any[];
  total: number;
}

export interface IMessage {
  header: {
    id: string;
    type: string;
    txtype: string;
    author: string;
    key: string;
    created: string;
    namespace: string;
    topics: string[];
    tag: string;
    datahash: string;
  };
  hash: string;
  batch: string;
  state: MessageStatus;
  confirmed: string;
  data: {
    id: string;
    hash: string;
  }[];
}

export interface IMessageData {
  id: string;
  validator: string;
  namespace: string;
  hash: string;
  created: string;
  value: any;
}

export type IMessageEvent = IEvent;

export type IMessageOperation = IOperation;

export type IMessageTransaction = ITransaction;

export interface IMetric {
  count: string;
  timestamp: string;
  types: IMetricType[];
}

export interface IMetricType {
  count: string;
  type: string;
}

export interface INamespace {
  id: string;
  name: string;
  description: string;
  type: string;
  created: string;
  confirmed: string;
}

export interface INode {
  id: string;
  did: string;
  type: string;
  parent: string;
  namespace: string;
  name: string;
  profile: {
    cert: string;
    endpoint: string;
    id: string;
  };
  messages: {
    claim: string;
    verification: string | null;
    update: string | null;
  };
  created: string;
  updated: string;
}

export interface IOperation {
  id: string;
  namespace: string;
  tx: string;
  type: string;
  status: OperationStatus;
  plugin: string;
  input?: any;
  output?: {
    id: string;
    success: boolean;
  };
  created: string;
  updated: string;
}

export interface IOrganization {
  id: string;
  did: string;
  type: string;
  namespace: string;
  name: string;
  messages: {
    claim: string;
    verification: string | null;
    update: string | null;
  };
  created: string;
  updated: string;
}

export interface IPagedBlockchainEventResponse {
  pageParam: number;
  count: number;
  items: IBlockchainEvent[];
  total: number;
}

export interface IPagedEventResponse {
  pageParam: number;
  count: number;
  items: IEvent[];
  total: number;
}

export interface IPagedMessageResponse {
  pageParam: number;
  count: number;
  items: IMessage[];
  total: number;
}

export interface IPagedNodeResponse {
  pageParam: number;
  count: number;
  items: INode[];
  total: number;
}

export interface IPagedOperationResponse {
  pageParam: number;
  count: number;
  items: IOperation[];
  total: number;
}

export interface IPagedOrganizationResponse {
  pageParam: number;
  count: number;
  items: IOrganization[];
  total: number;
}

export interface IPagedTokenPoolResponse {
  pageParam: number;
  count: number;
  items: ITokenPool[];
  total: number;
}

export interface IPagedTokenTransferResponse {
  pageParam: number;
  count: number;
  items: ITokenTransfer[];
  total: number;
}

export interface IPagedTransactionResponse {
  pageParam: number;
  count: number;
  items: ITransaction[];
  total: number;
}

export interface IStatus {
  node: {
    name: string;
    registered: boolean;
    id: string;
  };
  org: {
    name: string;
    registered: boolean;
    identity: string;
    id: string;
  };
  defaults: {
    namespace: string;
  };
}

export interface ITokenAccount {
  key: string;
}

export interface ITokenConnector {
  [key: string]: string;
}

export interface ITokenPool {
  id: string;
  type: string;
  namespace: string;
  name: string;
  standard: string;
  protocolId: string;
  connector: string;
  message: string;
  state: 'confirmed' | 'pending';
  created: string;
  tx: {
    type: string;
    id: string;
  };
}

export interface ITokenTransfer {
  type: 'mint' | 'transfer' | 'burn';
  localId: string;
  pool: string;
  uri: string;
  connector: string;
  namespace: string;
  key: string;
  from?: string;
  to?: string;
  amount: string;
  protocolId: string;
  message: string;
  messageHash: string;
  created: string;
  tx: {
    type: string;
    id: string;
  };
  blockchainEvent: string;
}

export interface ITransaction {
  id: string;
  namespace: string;
  type: string;
  created: string;
  blockchainIds: string[];
}

export interface ITxStatus {
  status: string;
  details: {
    type: string;
    subtype?: string;
    status: string;
    timestamp: string;
    id: string;
    info?: {
      address?: string;
      blockNumber?: string;
      logIndex?: string;
      signature?: string;
      subId?: string;
      timestamp?: string;
      transactionHash?: string;
      transactionIndex?: string;
    };
  }[];
}
