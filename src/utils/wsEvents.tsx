import {
  FF_EVENTS,
  FF_MESSAGES,
  FF_MESSAGES_CATEGORY_MAP,
  FF_TX,
  FF_TX_CATEGORY_MAP,
} from '../interfaces';

export enum WsEventTypes {
  BLOCKCHAIN_EVENT = 'blockchainevent',
  CONTRACT_API = 'contract_api_confirmed',
  // Denotes normal event type
  EVENT = 'type',
  MESSAGE = 'message',
  TRANSACTION = 'transaction',
}

export const isEventType = (
  event: any | undefined,
  eventType: string
): boolean => {
  if (!event) {
    return false;
  }
  switch (eventType) {
    case WsEventTypes.BLOCKCHAIN_EVENT:
      return event[WsEventTypes.BLOCKCHAIN_EVENT] !== undefined;
    case FF_EVENTS.CONTRACT_API_CONFIRMED:
      return event.type === FF_EVENTS.CONTRACT_API_CONFIRMED;
    case FF_EVENTS.DATATYPE_CONFIRMED:
      return event.type === FF_EVENTS.DATATYPE_CONFIRMED;
    case FF_EVENTS.CONTRACT_INTERFACE_CONFIRMED:
      return event.type === FF_EVENTS.CONTRACT_INTERFACE_CONFIRMED;
    case WsEventTypes.MESSAGE:
      return (
        event?.message?.header?.type &&
        FF_MESSAGES_CATEGORY_MAP[event.message.header.type as FF_MESSAGES] !==
          undefined
      );
    case FF_EVENTS.TOKEN_POOL_CONFIRMED:
      return event.type === FF_EVENTS.TOKEN_POOL_CONFIRMED;
    case FF_EVENTS.TOKEN_TRANSFER_CONFIRMED:
      return event.type === FF_EVENTS.TOKEN_TRANSFER_CONFIRMED;
    case FF_EVENTS.TOKEN_TRANSFER_FAILED:
      return event.type === FF_EVENTS.TOKEN_TRANSFER_FAILED;
    case WsEventTypes.TRANSACTION:
      return (
        event?.transaction?.type &&
        FF_TX_CATEGORY_MAP[event.transaction.type as FF_TX] !== undefined
      );
    case WsEventTypes.EVENT:
      return event?.type;
    default:
      return false;
  }
};
