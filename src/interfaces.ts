export interface IDataTableColumn {
  value: string | number | JSX.Element | undefined;
}

export interface IDataTableRecord {
  columns: IDataTableColumn[];
  key: string;
  onClick?: () => void;
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
  batchId: string;
  confirmed: number;
  data: IData[];
  hash: string;
  header: IFireflyHeader;
  sequence: number;
}

export interface ITransaction {
  confirmed: number;
  created: number;
  hash: string;
  id: string;
  protocolId: string;
  sequence: number;
  status: string;
  info: IEthTransactionInfo;
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
    batchId: string;
    payloadRef: string;
    timestamp: string;
  };
  logIndex: string;
  signature: string;
  subId: string;
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
