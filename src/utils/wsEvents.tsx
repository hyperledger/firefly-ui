import { FF_EVENTS, INewEventSet } from '../interfaces';

export const hasAnyEvent = (events: INewEventSet) => {
  return (
    events[FF_EVENTS.BLOCKCHAIN_EVENT_RECEIVED] ||
    events[FF_EVENTS.CONTRACT_API_CONFIRMED] ||
    events[FF_EVENTS.CONTRACT_INTERFACE_CONFIRMED] ||
    events[FF_EVENTS.DATATYPE_CONFIRMED] ||
    events[FF_EVENTS.IDENTITY_CONFIRMED] ||
    events[FF_EVENTS.IDENTITY_UPDATED] ||
    events[FF_EVENTS.NS_CONFIRMED] ||
    events[FF_EVENTS.MSG_CONFIRMED] ||
    events[FF_EVENTS.MSG_REJECTED] ||
    events[FF_EVENTS.TX_SUBMITTED] ||
    events[FF_EVENTS.TOKEN_POOL_CONFIRMED] ||
    events[FF_EVENTS.TOKEN_APPROVAL_CONFIRMED] ||
    events[FF_EVENTS.TOKEN_APPROVAL_OP_FAILED] ||
    events[FF_EVENTS.TOKEN_TRANSFER_CONFIRMED] ||
    events[FF_EVENTS.TOKEN_TRANSFER_OP_FAILED]
  );
};

export const hasApiEvent = (events: INewEventSet) => {
  return events[FF_EVENTS.CONTRACT_API_CONFIRMED];
};

export const hasBlockchainEvent = (events: INewEventSet) => {
  return (
    events[FF_EVENTS.BLOCKCHAIN_EVENT_RECEIVED] ||
    events[FF_EVENTS.CONTRACT_API_CONFIRMED] ||
    events[FF_EVENTS.CONTRACT_INTERFACE_CONFIRMED] ||
    events[FF_EVENTS.DATATYPE_CONFIRMED] ||
    events[FF_EVENTS.IDENTITY_CONFIRMED] ||
    events[FF_EVENTS.IDENTITY_UPDATED] ||
    events[FF_EVENTS.NS_CONFIRMED]
  );
};

export const hasDatatypeEvent = (events: INewEventSet) => {
  return events[FF_EVENTS.DATATYPE_CONFIRMED];
};

export const hasDataEvent = (events: INewEventSet) => {
  return events[FF_EVENTS.MSG_CONFIRMED] || events[FF_EVENTS.MSG_REJECTED];
};

export const hasIdentityEvent = (events: INewEventSet) => {
  return (
    events[FF_EVENTS.IDENTITY_CONFIRMED] || events[FF_EVENTS.IDENTITY_UPDATED]
  );
};

export const hasInterfaceEvent = (events: INewEventSet) => {
  return events[FF_EVENTS.CONTRACT_INTERFACE_CONFIRMED];
};

export const hasOffchainEvent = (events: INewEventSet) => {
  return (
    events[FF_EVENTS.MSG_CONFIRMED] ||
    events[FF_EVENTS.MSG_REJECTED] ||
    events[FF_EVENTS.DATATYPE_CONFIRMED]
  );
};

export const hasPoolEvent = (events: INewEventSet) => {
  return events[FF_EVENTS.TOKEN_POOL_CONFIRMED];
};

export const hasTransferEvent = (events: INewEventSet) => {
  return (
    events[FF_EVENTS.TOKEN_POOL_CONFIRMED] ||
    events[FF_EVENTS.TOKEN_APPROVAL_CONFIRMED] ||
    events[FF_EVENTS.TOKEN_APPROVAL_OP_FAILED] ||
    events[FF_EVENTS.TOKEN_TRANSFER_CONFIRMED] ||
    events[FF_EVENTS.TOKEN_TRANSFER_OP_FAILED]
  );
};
export const hasApprovalEvent = (events: INewEventSet) => {
  return (
    events[FF_EVENTS.TOKEN_APPROVAL_CONFIRMED] ||
    events[FF_EVENTS.TOKEN_APPROVAL_OP_FAILED]
  );
};

export const hasTxEvent = (events: INewEventSet) => {
  return events[FF_EVENTS.TX_SUBMITTED];
};
