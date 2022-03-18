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

export * from './blockchainEventTypes';
export * from './eventTypes';
export * from './messageTypes';
export * from './operationTypes';
export * from './transactionTypes';
export * from './transferTypes';
export * from './txStatusTypes';

export interface IBlockchainCategory {
  category: string;
  color: string;
  enrichedEventKey?: string;
  nicename: string;
}
