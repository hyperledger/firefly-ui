import {
  ACTIVITY_PATH,
  APIS_PATH,
  BLOCKCHAIN_PATH,
  DATA_PATH,
  DATATYPES_PATH,
  EVENTS_PATH,
  HOME_PATH,
  INTERFACES_PATH,
  LISTENERS_PATH,
  MESSAGES_PATH,
  NAMESPACES_PATH,
  OFFCHAIN_PATH,
  OPERATIONS_PATH,
  TRANSACTIONS_PATH,
  TOKENS_PATH,
  TRANSFERS_PATH,
  POOLS_PATH,
  ACCOUNTS_PATH,
  NETWORK_PATH,
  ORGANIZATIONS_PATH,
  NODES_PATH,
  MY_NODES_PATH,
  FF_DOCS,
} from '../../interfaces';

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
  activityOpPath: (ns: string) =>
    `/${NAMESPACES_PATH}/${ns}/${ACTIVITY_PATH}/${OPERATIONS_PATH}`,
  // Blockchain
  blockchainPath: (ns: string) =>
    `/${NAMESPACES_PATH}/${ns}/${BLOCKCHAIN_PATH}`,
  blockchainEventsPath: (ns: string) =>
    `/${NAMESPACES_PATH}/${ns}/${BLOCKCHAIN_PATH}/${EVENTS_PATH}`,
  blockchainApisPath: (ns: string) =>
    `/${NAMESPACES_PATH}/${ns}/${BLOCKCHAIN_PATH}/${APIS_PATH}`,
  blockchainInterfacesPath: (ns: string) =>
    `/${NAMESPACES_PATH}/${ns}/${BLOCKCHAIN_PATH}/${INTERFACES_PATH}`,
  blockchainListenersPath: (ns: string) =>
    `/${NAMESPACES_PATH}/${ns}/${BLOCKCHAIN_PATH}/${LISTENERS_PATH}`,
  // Off-Chain
  offchainPath: (ns: string) => `/${NAMESPACES_PATH}/${ns}/${OFFCHAIN_PATH}`,
  offchainMessagesPath: (ns: string) =>
    `/${NAMESPACES_PATH}/${ns}/${OFFCHAIN_PATH}/${MESSAGES_PATH}`,
  offchainDataPath: (ns: string) =>
    `/${NAMESPACES_PATH}/${ns}/${OFFCHAIN_PATH}/${DATA_PATH}`,
  offchainDatatypesPath: (ns: string) =>
    `/${NAMESPACES_PATH}/${ns}/${OFFCHAIN_PATH}/${DATATYPES_PATH}`,
  // Tokens
  tokensPath: (ns: string) => `/${NAMESPACES_PATH}/${ns}/${TOKENS_PATH}`,
  tokensTransfersPath: (ns: string) =>
    `/${NAMESPACES_PATH}/${ns}/${TOKENS_PATH}/${TRANSFERS_PATH}`,
  tokensPoolsPath: (ns: string) =>
    `/${NAMESPACES_PATH}/${ns}/${TOKENS_PATH}/${POOLS_PATH}`,
  tokensAccountsPath: (ns: string) =>
    `/${NAMESPACES_PATH}/${ns}/${TOKENS_PATH}/${ACCOUNTS_PATH}`,
  // Network
  networkPath: (ns: string) => `/${NAMESPACES_PATH}/${ns}/${NETWORK_PATH}`,
  networkOrgsPath: (ns: string) =>
    `/${NAMESPACES_PATH}/${ns}/${NETWORK_PATH}/${ORGANIZATIONS_PATH}`,
  networkNodesPath: (ns: string) =>
    `/${NAMESPACES_PATH}/${ns}/${NETWORK_PATH}/${NODES_PATH}`,
  // My Node
  myNodePath: (ns: string) => `/${NAMESPACES_PATH}/${ns}/${MY_NODES_PATH}`,
  // Docs
  docsPath: FF_DOCS,
};
