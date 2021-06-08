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
  Succeeded = 'Succeeded',
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
  id: string;
  type: string;
  txtype: string;
  author: string;
  created: string;
  namespace: string;
  topic: string[];
  tag: string;
  datahash: string;
}

export interface IData {
  hash: string;
  id: string;
}

export interface IMessage {
  batchID: string;
  confirmed: string;
  data: IData[];
  hash: string;
  header: IFireflyHeader;
  sequence: number;
  local: boolean;
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
  created: number;
  hash: string;
  id: string;
  protocolId?: string;
  sequence: number;
  status: TXStatus;
  info?: IEthTransactionInfo;
  subject: {
    signer: string;
    namespace: string;
    type: string;
    reference: string;
  };
}

export interface IEthTransactionInfo {
  address: string;
  blockNumber: string;
  data: {
    author: string;
    batchHash: string;
    contexts: string[];
    namespace: string;
    payloadRef: string;
    timestamp: string;
    uuids: string;
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
