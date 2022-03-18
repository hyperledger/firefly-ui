// Copyright © 2022 Kaleido, Inc.
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

export interface ICreatedFilter {
  filterString: string;
  filterTime: number;
}

export type CreatedFilterOptions = '1hour' | '24hours' | '7days' | '30days';

export const ApiFilters = ['id', 'name', 'interface'];

export const BlockchainEventFilters = [
  'id',
  'source',
  'name',
  'protocolid',
  'listener',
  'tx.type',
  'tx.id',
  'timestamp',
];

export const DataFilters = [
  'id',
  'validator',
  'datatype.name',
  'datatype.version',
  'hash',
  'blob.hash',
  'blob.public',
  'blob.name',
  'blob.size',
  'created',
  'value',
];

export const DatatypesFilters = [
  'id',
  'message',
  'validator',
  'name',
  'version',
  'created',
];

export const EventFilters = [
  'id',
  'type',
  'reference',
  'correlator',
  'tx',
  'sequence',
  'created',
];

export const IdentityFilters = [
  'id',
  'did',
  'parent',
  'messages.claim',
  'messages.verification',
  'messages.update',
  'type',
  'name',
  'description',
  'profile',
  'created',
  'updated',
];

export const ListenerFilters = ['id', 'interface', 'protocolid', 'created'];

export const MessageFilters = [
  'id',
  'cid',
  'type',
  'author',
  'key',
  'topics',
  'tag',
  'group',
  'created',
  'hash',
  'pins',
  'state',
  'confirmed',
  'sequence',
  'txtype',
  'batch',
];

export const OperationFilters = [
  'id',
  'tx',
  'type',
  'status',
  'error',
  'plugin',
  'input',
  'output',
  'created',
  'updated',
  'retry',
];

export const PoolFilters = [
  'id',
  'type',
  'name',
  'standard',
  'protocolid',
  'symbol',
  'message',
  'state',
  'created',
  'connector',
  'tx.type',
  'tx.id',
];

export const TransactionFilters = ['id', 'type', 'created', 'blockchainids'];

export const TransferFilters = [
  'localid',
  'pool',
  'tokenindex',
  'uri',
  'connector',
  'key',
  'from',
  'to',
  'amount',
  'protocolid',
  'message',
  'messagehash',
  'created',
  'tx.type',
  'tx.id',
  'blockchainevent',
  'type',
];
