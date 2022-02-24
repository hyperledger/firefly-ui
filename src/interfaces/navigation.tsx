export interface INavItem {
  name: string;
  action: () => void;
  icon?: JSX.Element;
  itemIsActive: boolean;
}

export const NAMESPACES_PATH = 'namespaces';
export const ACCOUNTS_PATH = 'accounts';
export const ACTIVITY_PATH = 'activity';
export const EVENTS_PATH = 'events';
export const OPERATIONS_PATH = 'operations';
export const POOLS_PATH = 'pools';
export const TOKENS_PATH = 'tokens';
export const TRANSACTIONS_PATH = 'transactions';
export const TRANSFERS_PATH = 'transfers';
