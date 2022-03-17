import { IBlockchainCategory } from '.';
import { FFColors } from '../../theme';

export interface IHistEventBucket {
  [EventCategoryEnum.BLOCKCHAIN]: number;
  [EventCategoryEnum.MESSAGES]: number;
  [EventCategoryEnum.TOKENS]: number;
}

export interface IHistEventTimeMap {
  [key: string]: IHistEventBucket;
}

export enum EventCategoryEnum {
  BLOCKCHAIN = 'Blockchain',
  MESSAGES = 'Messages',
  TOKENS = 'Tokens',
}

export enum FF_EVENTS {
  // Blockchain Event
  BLOCKCHAIN_EVENT_RECEIVED = 'blockchain_event_received',
  CONTRACT_API_CONFIRMED = 'contract_api_confirmed',
  CONTRACT_INTERFACE_CONFIRMED = 'contract_interface_confirmed',
  DATATYPE_CONFIRMED = 'datatype_confirmed',
  GROUP_CONFIRMED = 'group_confirmed',
  IDENTITY_CONFIRMED = 'identity_confirmed',
  IDENTITY_UPDATED = 'identity_updated',
  NS_CONFIRMED = 'namespace_confirmed',
  // Message/Definitions
  MSG_CONFIRMED = 'message_confirmed',
  MSG_REJECTED = 'message_rejected',
  TX_SUBMITTED = 'transaction_submitted',
  // Transfers
  TOKEN_POOL_CONFIRMED = 'token_pool_confirmed',
  TOKEN_APPROVAL_CONFIRMED = 'token_approval_confirmed',
  TOKEN_APPROVAL_FAILED = 'token_approval_confirmed',
  TOKEN_TRANSFER_CONFIRMED = 'token_transfer_confirmed',
  TOKEN_TRANSFER_FAILED = 'token_transfer_op_failed',
}

export const FF_EVENTS_CATEGORY_MAP: { [key: string]: IBlockchainCategory } = {
  // Blockchain Events
  [FF_EVENTS.BLOCKCHAIN_EVENT_RECEIVED]: {
    category: EventCategoryEnum.BLOCKCHAIN,
    color: FFColors.Yellow,
    nicename: 'blockchainEventReceived',
    enrichedEventKey: 'blockchainEvent',
  },
  [FF_EVENTS.CONTRACT_API_CONFIRMED]: {
    category: EventCategoryEnum.BLOCKCHAIN,
    color: FFColors.Yellow,
    nicename: 'contractApiConfirmed',
  },
  [FF_EVENTS.CONTRACT_INTERFACE_CONFIRMED]: {
    category: EventCategoryEnum.BLOCKCHAIN,
    color: FFColors.Yellow,
    nicename: 'contractInterfaceConfirmed',
  },
  [FF_EVENTS.DATATYPE_CONFIRMED]: {
    category: EventCategoryEnum.BLOCKCHAIN,
    color: FFColors.Yellow,
    nicename: 'datatypeConfirmed',
  },
  [FF_EVENTS.GROUP_CONFIRMED]: {
    category: EventCategoryEnum.BLOCKCHAIN,
    color: FFColors.Yellow,
    nicename: 'groupConfirmed',
  },
  [FF_EVENTS.IDENTITY_CONFIRMED]: {
    category: EventCategoryEnum.BLOCKCHAIN,
    color: FFColors.Yellow,
    nicename: 'identityConfirmed',
  },
  [FF_EVENTS.IDENTITY_UPDATED]: {
    category: EventCategoryEnum.BLOCKCHAIN,
    color: FFColors.Yellow,
    nicename: 'identityUpdated',
  },
  [FF_EVENTS.NS_CONFIRMED]: {
    category: EventCategoryEnum.BLOCKCHAIN,
    color: FFColors.Yellow,
    nicename: 'namespaceConfirmed',
  },
  // Message Events
  [FF_EVENTS.MSG_CONFIRMED]: {
    category: EventCategoryEnum.MESSAGES,
    color: FFColors.Orange,
    nicename: 'messageConfirmed',
    enrichedEventKey: 'message',
  },
  [FF_EVENTS.MSG_REJECTED]: {
    category: EventCategoryEnum.MESSAGES,
    color: FFColors.Orange,
    nicename: 'messageRejected',
    enrichedEventKey: 'message',
  },
  [FF_EVENTS.TX_SUBMITTED]: {
    category: EventCategoryEnum.MESSAGES,
    color: FFColors.Orange,
    nicename: 'transactionSubmitted',
    enrichedEventKey: 'transaction',
  },
  // Token Events
  [FF_EVENTS.TOKEN_POOL_CONFIRMED]: {
    category: EventCategoryEnum.TOKENS,
    color: FFColors.Pink,
    nicename: 'tokenPoolConfirmed',
  },
  [FF_EVENTS.TOKEN_APPROVAL_CONFIRMED]: {
    category: EventCategoryEnum.TOKENS,
    color: FFColors.Pink,
    nicename: 'tokenApprovalConfirmed',
  },
  [FF_EVENTS.TOKEN_APPROVAL_FAILED]: {
    category: EventCategoryEnum.TOKENS,
    color: FFColors.Pink,
    nicename: 'tokenApprovalFailed',
  },
  [FF_EVENTS.TOKEN_TRANSFER_CONFIRMED]: {
    category: EventCategoryEnum.TOKENS,
    color: FFColors.Pink,
    nicename: 'tokenTransferConfirmed',
  },
  [FF_EVENTS.TOKEN_TRANSFER_FAILED]: {
    category: EventCategoryEnum.TOKENS,
    color: FFColors.Pink,
    nicename: 'tokenTransferFailed',
  },
};
