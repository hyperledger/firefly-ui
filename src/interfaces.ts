export interface IDataTableColumn {
  value: string | number | JSX.Element;
}

export interface IDataTableRecord {
  columns: IDataTableColumn[];
  key: string;
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
