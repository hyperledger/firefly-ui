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

export interface INavItem {
  name: string;
  action: () => void;
  icon?: JSX.Element;
  itemIsActive: boolean;
}

export const ACTIVITY_PATH = 'activity';
export const APIS_PATH = 'apis';
export const BLOCKCHAIN_PATH = 'blockchain';
export const DATA_PATH = 'data';
export const DATATYPES_PATH = 'datatypes';
export const DOCS_PATH = 'https://hyperledger.github.io/firefly/';
export const EVENTS_PATH = 'events';
export const FILE_EXPLORER_PATH = 'fileExplorer';
export const HOME_PATH = 'home';
export const INTERFACES_PATH = 'interfaces';
export const LISTENERS_PATH = 'listeners';
export const MESSAGES_PATH = 'messages';
export const MY_NODES_PATH = 'myNode';
export const NAMESPACES_PATH = 'namespaces';
export const NETWORK_PATH = 'network';
export const NODES_PATH = 'nodes';
export const OFFCHAIN_PATH = 'offChain';
export const OPERATIONS_PATH = 'operations';
export const ORGANIZATIONS_PATH = 'organizations';
export const POOLS_PATH = 'pools';
export const TOKENS_PATH = 'tokens';
export const TRANSACTIONS_PATH = 'transactions';
export const TRANSFERS_PATH = 'transfers';

export const FF_NAV_PATHS = {
  // Home
  homePath: (ns: string) => `/${NAMESPACES_PATH}/${ns}/${HOME_PATH}`,
  // Activity
  activityTimelinePath: (ns: string) =>
    `/${NAMESPACES_PATH}/${ns}/${ACTIVITY_PATH}`,
  activityEventsPath: (ns: string) =>
    `/${NAMESPACES_PATH}/${ns}/${ACTIVITY_PATH}/${EVENTS_PATH}`,
  activityTxPath: (ns: string) =>
    `/${NAMESPACES_PATH}/${ns}/${ACTIVITY_PATH}/${TRANSACTIONS_PATH}`,
  activityTxDetailPath: (ns: string, txID: string) =>
    `/${NAMESPACES_PATH}/${ns}/${ACTIVITY_PATH}/${TRANSACTIONS_PATH}/${txID}`,
  activityOpPath: (ns: string, txID?: string) =>
    `/${NAMESPACES_PATH}/${ns}/${ACTIVITY_PATH}/${OPERATIONS_PATH}${
      txID ? `?filters=tx==${txID}` : ''
    }`,
  // Blockchain
  blockchainPath: (ns: string) =>
    `/${NAMESPACES_PATH}/${ns}/${BLOCKCHAIN_PATH}`,
  blockchainEventsPath: (ns: string, txID?: string) =>
    `/${NAMESPACES_PATH}/${ns}/${BLOCKCHAIN_PATH}/${EVENTS_PATH}${
      txID ? `?filters=tx.id==${txID}` : ''
    }`,
  blockchainApisPath: (ns: string, interfaceID?: string) =>
    `/${NAMESPACES_PATH}/${ns}/${BLOCKCHAIN_PATH}/${APIS_PATH}${
      interfaceID ? `?filters=interface==${interfaceID}` : ''
    }`,
  blockchainInterfacesPath: (ns: string, interfaceID?: string) =>
    `/${NAMESPACES_PATH}/${ns}/${BLOCKCHAIN_PATH}/${INTERFACES_PATH}${
      interfaceID ? `?filters=id==${interfaceID}` : ''
    }`,
  blockchainListenersPath: (ns: string, interfaceID?: string) =>
    `/${NAMESPACES_PATH}/${ns}/${BLOCKCHAIN_PATH}/${LISTENERS_PATH}${
      interfaceID ? `?filters=interface==${interfaceID}` : ''
    }`,
  // Off-Chain
  offchainPath: (ns: string) => `/${NAMESPACES_PATH}/${ns}/${OFFCHAIN_PATH}`,
  offchainMessagesPath: (ns: string, msgID?: string) =>
    `/${NAMESPACES_PATH}/${ns}/${OFFCHAIN_PATH}/${MESSAGES_PATH}${
      msgID ? `?filters=id==${msgID}` : ''
    }`,
  offchainDataPath: (ns: string, dataID?: string) =>
    `/${NAMESPACES_PATH}/${ns}/${OFFCHAIN_PATH}/${DATA_PATH}${
      dataID ? `?filters=id==${dataID}` : ''
    }`,
  offchainDatatypesPath: (ns: string, datatypeID?: string) =>
    `/${NAMESPACES_PATH}/${ns}/${OFFCHAIN_PATH}/${DATATYPES_PATH}${
      datatypeID ? `?filters=id==${datatypeID}` : ''
    }`,
  // Tokens
  tokensPath: (ns: string) => `/${NAMESPACES_PATH}/${ns}/${TOKENS_PATH}`,
  tokensTransfersPath: (ns: string, poolID?: string) =>
    `/${NAMESPACES_PATH}/${ns}/${TOKENS_PATH}/${TRANSFERS_PATH}${
      poolID ? `?filters=pool==${poolID}` : ''
    }`,
  tokensPoolsPath: (ns: string) =>
    `/${NAMESPACES_PATH}/${ns}/${TOKENS_PATH}/${POOLS_PATH}`,
  tokensPoolDetailsPath: (ns: string, poolID: string) =>
    `/${NAMESPACES_PATH}/${ns}/${TOKENS_PATH}/${POOLS_PATH}/${poolID}`,
  // Network
  networkPath: (ns: string) => `/${NAMESPACES_PATH}/${ns}/${NETWORK_PATH}`,
  networkOrgsPath: (ns: string) =>
    `/${NAMESPACES_PATH}/${ns}/${NETWORK_PATH}/${ORGANIZATIONS_PATH}`,
  networkNodesPath: (ns: string) =>
    `/${NAMESPACES_PATH}/${ns}/${NETWORK_PATH}/${NODES_PATH}`,
  // My Node
  myNodePath: (ns: string) => `/${NAMESPACES_PATH}/${ns}/${MY_NODES_PATH}`,
  // Docs
  docsPath: DOCS_PATH,
};
