export interface IEventBucket {
  Blockchain: number;
  Messages: number;
  Tokens: number;
}

export interface IHistEventTimeMap {
  [key: string]: IEventBucket;
}

export enum EventKeyEnum {
  BLOCKCHAIN = 'Blockchain',
  MESSAGES = 'Messages',
  TOKENS = 'Tokens',
}
