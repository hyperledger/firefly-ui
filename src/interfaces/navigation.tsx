export interface INavItem {
  name: string;
  action: () => void;
  icon?: JSX.Element;
  itemIsActive: boolean;
}

export const ACCOUNTS_PATH = 'accounts';
export const ACTIVITY_PATH = 'activity';
export const APIS_PATH = 'apis';
export const BLOCKCHAIN_PATH = 'blockchain';
export const DATA_PATH = 'data';
export const DATA_TYPES_PATH = 'dataTypes';
export const EVENTS_PATH = 'events';
export const FILE_EXPLORER_PATH = 'fileExplorer';
export const HOME_PATH = 'home';
export const INTERFACES_PATH = 'interfaces';
export const MESSAGES_PATH = 'messages';
export const MY_NODES_PATH = 'myNode';
export const NAMESPACES_PATH = 'namespaces';
export const NETWORK_PATH = 'network';
export const NODES_PATH = 'nodes';
export const OFFCHAIN_PATH = 'offChain';
export const OPERATIONS_PATH = 'operations';
export const ORGANIZATIONS_PATH = 'organizations';
export const POOLS_PATH = 'pools';
export const SUBSCRIPTIONS_PATH = 'subscriptions';
export const TOKENS_PATH = 'tokens';
export const TRANSACTIONS_PATH = 'transactions';
export const TRANSFERS_PATH = 'transfers';
