import {
  FF_EVENTS,
  FF_MESSAGES,
  FF_OPS,
  FF_TX,
  FF_TX_STATUS,
  MessageStatus,
  OperationStatus,
} from './enums';

export interface IBatch {
  id: string;
  type: string;
  namespace: string;
  node?: string;
  author: string;
  key: string;
  group: null | string;
  created: string;
  hash: string;
  manifest: any;
  tx?: {
    type: string;
    id: string;
  };
  confirmed: string | null;
}

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
  tx?: {
    type?: FF_TX;
    id?: string;
  };
}

export interface IContractInterface {
  id: string;
  message: string;
  namespace: string;
  name: string;
  description: string;
  version: string;
}

export interface IContractListener {
  id: string;
  interface: {
    id: string;
  };
  namespace: string;
  name?: string;
  protocolId: string;
  location?: {
    address?: string;
  };
  created: string;
  event: {
    name: string;
    description?: '';
    params: IFireFlyParam[];
  };
  topic?: string;
}

export interface IData {
  id: string;
  validator: string;
  namespace: string;
  hash: string;
  created: string;
  value?: any;
  blob?: IDatablob;
}

export interface IDatablob {
  hash: string;
  size: number;
  name: string;
}

export interface IDatatype {
  id: string;
  message: string;
  validator: string;
  namespace: string;
  name: string;
  version: string;
  hash: string;
  created: string;
  value?: any;
}

export interface IEvent {
  id: string;
  sequence: number;
  type: FF_EVENTS;
  namespace: string;
  reference: string;
  created: string;
  tx?: string;
  blockchainEvent?: IBlockchainEvent;
  contractAPI?: IFireflyApi;
  contractInterface?: IContractInterface;
  datatype?: IDatatype;
  identity?: IIdentity;
  message?: IMessage;
  namespaceDetails?: INamespace;
  tokenApproval?: ITokenApproval;
  tokenPool?: ITokenPool;
  transaction?: ITransaction;
  tokenTransfer?: ITokenTransfer;
}

export interface IFireflyApi {
  id: string;
  namespace: string;
  interface: {
    id: string;
  };
  location?: {
    address?: string;
  };
  name: string;
  message: string;
  urls: {
    openapi: string;
    ui: string;
  };
}

export interface IFireFlyParam {
  name: string;
  schema: any;
  message?: IMessage;
  transaction?: ITransaction;
  blockchainevent?: IBlockchainEvent;
}

export interface IGenericPagedResponse {
  count: number;
  items: any[];
  total: number;
}

export interface IGroup {
  namespace: string;
  name: string;
  members: IGroupMember[];
  message: string;
  hash: string;
  created: string;
}

export interface IGroupMember {
  identity: string;
  node: string;
}

export interface IIdentity {
  id: string;
  did: string;
  type: string;
  namespace: string;
  parent?: string;
  name: string;
  messages: {
    claim: string;
    verification: null | string;
    update: null | string;
  };
  created: string;
  updated: string;
  verifiers: IVerifier[];
}

export interface IMessage {
  header: {
    id: string;
    type: FF_MESSAGES;
    txtype: FF_TX;
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
  isCapped: boolean;
  timestamp: string;
  types: IMetricType[];
}

export interface IMetricType {
  count: string;
  type: string;
}

export interface INamespace {
  id: string;
  message?: string;
  name: string;
  description: string;
  type: string;
  created: string;
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
  type: FF_OPS;
  status: OperationStatus;
  plugin: string;
  input?: any;
  output?: {
    id: string;
    success: boolean;
  };
  created: string;
  updated: string;
  retry?: string;
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

export interface IPagedBatchResponse {
  pageParam: number;
  count: number;
  items: IBatch[];
  total: number;
}

export interface IPagedBlockchainEventResponse {
  pageParam: number;
  count: number;
  items: IBlockchainEvent[];
  total: number;
}

export interface IPagedContractInterfaceResponse {
  pageParam: number;
  count: number;
  items: IContractInterface[];
  total: number;
}

export interface IPagedContractListenerResponse {
  pageParam: number;
  count: number;
  items: IContractListener[];
  total: number;
}

export interface IPagedDataResponse {
  pageParam: number;
  count: number;
  items: IData[];
  total: number;
}

export interface IPagedDatatypeResponse {
  pageParam: number;
  count: number;
  items: IDatatype[];
  total: number;
}

export interface IPagedEventResponse {
  pageParam: number;
  count: number;
  items: IEvent[];
  total: number;
}

export interface IPagedFireFlyApiResponse {
  pageParam: number;
  count: number;
  items: IFireflyApi[];
  total: number;
}

export interface IPagedGroupResponse {
  pageParam: number;
  count: number;
  items: IGroup[];
  total: number;
}

export interface IPagedIdentityResponse {
  pageParam: number;
  count: number;
  items: IIdentity[];
  total: number;
}

export interface IPagedMessageResponse {
  pageParam: number;
  count: number;
  items: IMessage[];
  total: number;
}

export interface IPagesNamespaceResponse {
  pageParam: number;
  count: number;
  items: INamespace[];
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

export interface IPagedSubscriptionsResponse {
  pageParam: number;
  count: number;
  items: ISubscription[];
  total: number;
}

export interface IPagedTokenApprovalResponse {
  pageParam: number;
  count: number;
  items: ITokenApproval[];
  total: number;
}

export interface IPagedTokenBalanceResponse {
  pageParam: number;
  count: number;
  items: ITokenBalance[];
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
  plugins: {
    blockchain: IStatusPluginDetails[];
    database: IStatusPluginDetails[];
    dataExchange: IStatusPluginDetails[];
    events: IStatusPluginDetails[];
    identity: IStatusPluginDetails[];
    sharedStorage: IStatusPluginDetails[];
    tokens: IStatusPluginDetails[];
  };
}

export interface IStatusPluginDetails {
  name?: string;
  pluginType: string;
}

export interface ISubscription {
  id: string;
  namespace: string;
  name: string;
  transport: string;
  filter?: any;
  options: {
    firstEvent: string;
    readAhead: number;
    withData: boolean;
  };
  created: string;
  updated: string | null;
}

export interface ITokenAccount {
  key: string;
}

export interface ITokenApproval {
  localId: string;
  pool: string;
  connector: string;
  key: string;
  operator: string;
  approved: boolean;
  namespace: string;
  protocolId: string;
  created: string;
  tx?: ITx;
  blockchainEvent: string;
}

export interface ITokenBalance {
  pool: string;
  uri: string;
  connector: string;
  namespace: string;
  key: string;
  balance: string;
  updated: string;
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
  symbol?: string;
  protocolId: string;
  connector: string;
  message: string;
  state: 'confirmed' | 'pending';
  created: string;
  tx?: ITx;
  info?: any;
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
  tx?: ITx;
  blockchainEvent: string;
}

export interface ITransaction {
  id: string;
  namespace: string;
  type: FF_TX;
  created: string;
  blockchainIds?: string[];
}

export interface ITx {
  type?: string;
  id?: string;
}

export interface ITxStatus {
  status: string;
  details: {
    type: FF_TX_STATUS;
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

export interface IVerifier {
  type: string;
  value: string;
}

export interface IWebsocketStatus {
  enabled: boolean;
  connections: IWebsocketConnection[];
}

export interface IWebsocketConnection {
  id: string;
  remoteAddress: string;
  userAgent: string;
  subscriptions: IWebsocketSubscriptions[];
}

export interface IWebsocketSubscriptions {
  ephemeral: boolean;
  namespace: string;
  name?: string;
}
