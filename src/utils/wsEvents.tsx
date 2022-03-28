import { FF_EVENTS } from '../interfaces';

export const hasApiEvent = (events: FF_EVENTS[]) => {
  return events.includes(FF_EVENTS.CONTRACT_API_CONFIRMED);
};

export const hasBlockchainEvent = (events: FF_EVENTS[]) => {
  return (
    events.includes(FF_EVENTS.BLOCKCHAIN_EVENT_RECEIVED) ||
    events.includes(FF_EVENTS.CONTRACT_API_CONFIRMED) ||
    events.includes(FF_EVENTS.CONTRACT_INTERFACE_CONFIRMED) ||
    events.includes(FF_EVENTS.DATATYPE_CONFIRMED) ||
    events.includes(FF_EVENTS.IDENTITY_CONFIRMED) ||
    events.includes(FF_EVENTS.IDENTITY_UPDATED) ||
    events.includes(FF_EVENTS.NS_CONFIRMED)
  );
};

export const hasDatatypeEvent = (events: FF_EVENTS[]) => {
  return events.includes(FF_EVENTS.DATATYPE_CONFIRMED);
};

export const hasDataEvent = (events: FF_EVENTS[]) => {
  return (
    events.includes(FF_EVENTS.MSG_CONFIRMED) ||
    events.includes(FF_EVENTS.MSG_REJECTED)
  );
};

export const hasInterfaceEvent = (events: FF_EVENTS[]) => {
  return events.includes(FF_EVENTS.CONTRACT_INTERFACE_CONFIRMED);
};

export const hasOffchainEvent = (events: FF_EVENTS[]) => {
  return (
    events.includes(FF_EVENTS.MSG_CONFIRMED) ||
    events.includes(FF_EVENTS.MSG_REJECTED) ||
    events.includes(FF_EVENTS.DATATYPE_CONFIRMED)
  );
};

export const hasPoolEvent = (events: FF_EVENTS[]) => {
  return events.includes(FF_EVENTS.TOKEN_POOL_CONFIRMED);
};

export const hasTransferEvent = (events: FF_EVENTS[]) => {
  return (
    events.includes(FF_EVENTS.TOKEN_POOL_CONFIRMED) ||
    events.includes(FF_EVENTS.TOKEN_APPROVAL_CONFIRMED) ||
    events.includes(FF_EVENTS.TOKEN_APPROVAL_OP_FAILED) ||
    events.includes(FF_EVENTS.TOKEN_TRANSFER_CONFIRMED) ||
    events.includes(FF_EVENTS.TOKEN_TRANSFER_FAILED)
  );
};

export const hasTxEvent = (events: FF_EVENTS[]) => {
  return events.includes(FF_EVENTS.TX_SUBMITTED);
};
