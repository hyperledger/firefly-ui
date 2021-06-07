// Copyright © 2021 Kaleido, Inc.
//
// SPDX-License-Identifier: Apache-2.0
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

export type DataView = 'timeline' | 'list';

export enum TXStatus {
  Confirmed = 'Confirmed',
  Pending = 'Pending',
  Error = 'Error',
}

export type CreatedFilterOptions = '24hours' | '7days' | '30days';

export type FilterOptions = CreatedFilterOptions;

export interface IDataTableColumn {
  value: string | number | JSX.Element | undefined;
}

export interface IFilterItem {
  value: string;
  label: string;
}

export interface IPieChartElement {
  id: string;
  label: string;
  value: number;
  color: string;
}

export interface ITimelineItem {
  title?: string;
  description?: string;
  icon?: JSX.Element;
  time?: string;
  onClick?: () => void;
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

export interface IOrganization {
  created: string;
  description: string;
  identity: string;
  message: string;
  parent: string;
}
