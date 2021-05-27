export interface IDataTableColumn {
  value: string | number | JSX.Element | undefined;
}

export enum TXStatus {
  Confirmed = 'confirmed',
  Pending = 'pending',
  Error = 'error',
}

export interface IPieChartElement {
  id: string;
  label: string;
  value: number;
  color: string;
}

export interface IDataTableRecord {
  columns: IDataTableColumn[];
  key: string;
  onClick?: () => void;
}

export interface IHistory {
  viewMessage: IMessage;
}

export interface IFireflyHeader {
  author: string;
  cid: string;
  context: string;
  created: number;
  datahash: string;
  group: string;
  id: string;
  namespace: string;
  topic: string;
  tx: {
    id: string;
    type: string;
  };
  type: string;
}

export interface IData {
  hash: string;
  id: string;
}

export interface IMessage {
  batchID: string;
  confirmed: number;
  data: IData[];
  hash: string;
  header: IFireflyHeader;
  sequence: number;
}

export interface INamespace {
  id: string;
  name: string;
  description: string;
  type: string;
  created: string;
  confirmed: string;
}

export interface ITransaction {
  confirmed?: number;
  created: number;
  hash: string;
  id: string;
  protocolId?: string;
  sequence: number;
  status: TXStatus;
  info?: IEthTransactionInfo;
  subject: {
    author: string;
    batch: string;
    message: string;
    namespace: string;
    type: string;
  };
}

export interface IEthTransactionInfo {
  address: string;
  blockNumber: string;
  data: {
    author: string;
    batchID: string;
    payloadRef: string;
    timestamp: string;
  };
  logIndex: string;
  signature: string;
  subID: string;
  transactionHash: string;
  transactionIndex: string;
}

export interface IData {
  created: number;
  definition: {
    name: string;
    version: string;
  };
  hash: string;
  id: string;
  namespace: string;
  validator: string;
  value: any;
}

export interface IBatch {
  author: string;
  confirmed: string;
  created: string;
  hash: string;
  id: string;
  namespace: string;
  payload: {
    data: IData[];
    messages: IMessage[];
    tx: {
      id: string;
      type: string;
    };
  };
  payloadRef: string;
  type: string;
}
