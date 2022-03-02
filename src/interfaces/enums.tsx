export enum EventKeyEnum {
  BLOCKCHAIN = 'Blockchain',
  MESSAGES = 'Messages',
  TOKENS = 'Tokens',
}

export enum MessageKeyEnum {
  BLOCKCHAIN = 'Blockchain',
  MESSAGES = 'Messages',
  TOKENS = 'Tokens',
}

export enum OperationKeyEnum {
  BLOCKCHAIN = 'Blockchain',
  MESSAGES = 'Messages',
  TOKENS = 'Tokens',
}

export enum TransferKeyEnum {
  MINT = 'Mint',
  TRANSFER = 'Transfer',
  BURN = 'Burn',
}

export enum MessageStatus {
  STAGED = 'staged',
  READY = 'ready',
  SENT = 'sent',
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  REJECTED = 'rejected',
}

export enum OperationStatus {
  FAILED = 'Failed',
  PENDING = 'Pending',
  SUCCEEDED = 'Succeeded',
}

export enum TransactionStatus {
  FAILED = 'Failed',
  PENDING = 'Pending',
  SUCCEEDED = 'Succeeded',
}
