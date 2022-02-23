export interface IEvent {
  id: string;
  sequence: number;
  type: string;
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

export interface IMetric {
  count: string;
  timestamp: string;
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
  message: string;
  owner: string;
  name: string;
  dx: {
    peer: string;
    endpoint: {
      cert: string;
      endpoint: string;
      id: string;
    };
  };
  created: string;
}

export interface IOrganization {
  id: string;
  message: string;
  identity: string;
  name: string;
  created: string;
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

export interface ITxBlockchainEvent {
  id: string;
  sequence: number;
  source: string;
  namespace: string;
  name: string;
  protocolId: string;
  output: {
    author: string;
    batchHash: string;
    contexts: string[];
    namespace: string;
    payloadRef: string;
    timestamp: string;
    uuids: string;
  };
  info: {
    address: string;
    blockNumber: string;
    logIndex: string;
    signature: string;
    subId: string;
    timestamp: string;
    transactionHash: string;
    transactionIndex: string;
  };
  timestamp: string;
  tx: {
    type: string;
    id: string;
  };
}

export interface ITxOperation {
  id: string;
  namespace: string;
  tx: string;
  type: string;
  status: string;
  plugin: string;
  output: {
    id: string;
    success: boolean;
  };
  created: string;
  updated: string;
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
