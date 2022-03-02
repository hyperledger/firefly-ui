import { FFColors } from '../theme';

export enum FF_EVENTS {
  // Message/Definitions
  MSG_CONFIRMED = 'message_confirmed',
  MSG_REJECTED = 'message_rejected',
  TX_SUBMITTED = 'transaction_submitted',
  // Blockchain Event
  BLOCKCHAIN_EVENT = 'blockchain_event',
  CONTRACT_API_CONFIRMED = 'contract_api_confirmed',
  CONTRACT_INTERFACE_CONFIRMED = 'contract_interface_confirmed',
  DATATYPE_CONFIRMED = 'datatype_confirmed',
  GROUP_CONFIRMED = 'group_confirmed',
  NS_CONFIRMED = 'namespace_confirmed',
  TOKEN_POOL_CONFIRMED = 'token_pool_confirmed',
  // Transfers
  TOKEN_TRANSFER_CONFIRMED = 'token_transfer_confirmed',
  TOKEN_TRANSFER_FAILED = 'token_transfer_op_failed',
}

export const FF_EVENTS_COLOR_MAP: { [key: string]: string } = {
  // Message/Definitions
  [FF_EVENTS.MSG_CONFIRMED]: FFColors.Orange,
  [FF_EVENTS.MSG_REJECTED]: FFColors.Orange,
  [FF_EVENTS.TX_SUBMITTED]: FFColors.Orange,
  // Blockchain Event
  [FF_EVENTS.BLOCKCHAIN_EVENT]: FFColors.Yellow,
  [FF_EVENTS.CONTRACT_API_CONFIRMED]: FFColors.Yellow,
  [FF_EVENTS.CONTRACT_INTERFACE_CONFIRMED]: FFColors.Yellow,
  [FF_EVENTS.DATATYPE_CONFIRMED]: FFColors.Yellow,
  [FF_EVENTS.GROUP_CONFIRMED]: FFColors.Yellow,
  [FF_EVENTS.NS_CONFIRMED]: FFColors.Yellow,
  [FF_EVENTS.TOKEN_POOL_CONFIRMED]: FFColors.Yellow,
  // Transfers
  [FF_EVENTS.TOKEN_TRANSFER_CONFIRMED]: FFColors.Pink,
  [FF_EVENTS.TOKEN_TRANSFER_FAILED]: FFColors.Pink,
};

export const OpStatusColorMap: { [key: string]: string } = {
  Succeeded: FFColors.Purple,
  Pending: FFColors.Orange,
  Failed: FFColors.Red,
};

export const TxStatusColorMap: { [key: string]: string } = {
  Succeeded: FFColors.Purple,
  Sending: FFColors.Orange,
  Failed: FFColors.Red,
};

export const TransferColorMap = {
  mint: FFColors.Yellow,
  transfer: FFColors.Orange,
  burn: FFColors.Pink,
};

export const PoolStateColorMap = {
  confirmed: FFColors.Purple,
  pending: FFColors.Orange,
};
