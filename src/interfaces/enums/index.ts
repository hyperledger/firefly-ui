export * from './eventTypes';
export * from './messageTypes';
export * from './operationTypes';
export * from './transferTypes';

export interface IBlockchainCategory {
  category: string;
  color: string;
  enrichedEventKey?: string;
  nicename: string;
}
