import { t } from 'i18next';
import { LaunchButton } from '../../components/Buttons/LaunchButton';
import { FFColors } from '../../theme';
import { getShortHash } from '../../utils';
import { IEvent } from '../api';
import { FF_NAV_PATHS } from '../navigation';

export type INewEventSet = {
  [key in FF_EVENTS]: boolean;
};

export interface IHistEventBucket {
  [EventCategoryEnum.BLOCKCHAIN]: number;
  [EventCategoryEnum.MESSAGES]: number;
  [EventCategoryEnum.TOKENS]: number;
  Truncated: number;
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
  TOKEN_APPROVAL_OP_FAILED = 'token_approval_op_failed',
  TOKEN_TRANSFER_CONFIRMED = 'token_transfer_confirmed',
  TOKEN_TRANSFER_FAILED = 'token_transfer_op_failed',
}

interface IEventCategory {
  category: string;
  color: string;
  enrichedEventKey: string;
  enrichedEventString: (key: any) => string;
  nicename: string;
  referenceIDName: string;
  referenceIDButton: (ns: string, refID: string) => JSX.Element;
}

export const getEnrichedEventText = (event: IEvent) => {
  const eventObject = FF_EVENTS_CATEGORY_MAP[event.type];
  if (eventObject) {
    return eventObject.enrichedEventString(event);
  }
  return t('event');
};

export const FF_EVENTS_CATEGORY_MAP: {
  [key in FF_EVENTS]: IEventCategory;
} = {
  // Blockchain Events
  [FF_EVENTS.BLOCKCHAIN_EVENT_RECEIVED]: {
    category: EventCategoryEnum.BLOCKCHAIN,
    color: FFColors.Yellow,
    nicename: 'blockchainEventReceived',
    enrichedEventKey: 'blockchainevent',
    enrichedEventString: (event: IEvent): string =>
      `${event.blockchainEvent?.name}${
        event.blockchainEvent?.protocolId
          ? ', Protocol ID=' + getShortHash(event.blockchainEvent?.protocolId)
          : ''
      }`,
    referenceIDName: 'blockchainEventID',
    referenceIDButton: (ns: string, refID: string): JSX.Element => (
      <LaunchButton link={FF_NAV_PATHS.blockchainEventsPath(ns, refID)} />
    ),
  },
  [FF_EVENTS.CONTRACT_API_CONFIRMED]: {
    category: EventCategoryEnum.BLOCKCHAIN,
    color: FFColors.Yellow,
    nicename: 'contractApiConfirmed',
    enrichedEventKey: 'contractAPI',
    enrichedEventString: (event: IEvent): string =>
      `${event.contractAPI?.name}${
        event.contractAPI?.location?.address
          ? ', Address=' + getShortHash(event.contractAPI?.location?.address)
          : ''
      }`,
    referenceIDName: 'apiID',
    referenceIDButton: (ns: string, refID: string): JSX.Element => (
      <LaunchButton link={FF_NAV_PATHS.blockchainApisPath(ns, refID)} />
    ),
  },
  [FF_EVENTS.CONTRACT_INTERFACE_CONFIRMED]: {
    category: EventCategoryEnum.BLOCKCHAIN,
    color: FFColors.Yellow,
    nicename: 'contractInterfaceConfirmed',
    enrichedEventKey: 'contractInterface',
    enrichedEventString: (event: IEvent): string =>
      `${event.contractInterface?.name}${
        event.contractInterface?.version
          ? ', Version=' + event.contractInterface?.version
          : ''
      }`,
    referenceIDName: 'interfaceID',
    referenceIDButton: (ns: string, refID: string): JSX.Element => (
      <LaunchButton link={FF_NAV_PATHS.blockchainInterfacesPath(ns, refID)} />
    ),
  },
  [FF_EVENTS.DATATYPE_CONFIRMED]: {
    category: EventCategoryEnum.BLOCKCHAIN,
    color: FFColors.Yellow,
    nicename: 'datatypeConfirmed',
    enrichedEventKey: 'datatype',
    enrichedEventString: (event: IEvent): string =>
      `${event.datatype?.name}${
        event.datatype?.version ? ', Version=' + event.datatype?.version : ''
      }${
        event.datatype?.validator
          ? ', Validator=' + event.datatype?.validator
          : ''
      }`,
    referenceIDName: 'datatypeID',
    referenceIDButton: (ns: string, refID: string): JSX.Element => (
      <LaunchButton link={FF_NAV_PATHS.offchainDatatypesPath(ns, refID)} />
    ),
  },
  [FF_EVENTS.IDENTITY_CONFIRMED]: {
    category: EventCategoryEnum.BLOCKCHAIN,
    color: FFColors.Yellow,
    nicename: 'identityConfirmed',
    enrichedEventKey: 'identity',
    enrichedEventString: (event: IEvent): string =>
      `${event.identity?.name}${
        event.identity?.did ? ', DID=' + event.identity?.did : ''
      }${event.identity?.type ? ', Type=' + event.identity?.type : ''}`,
    referenceIDName: 'identityID',
    referenceIDButton: (ns: string, refID: string): JSX.Element => (
      <LaunchButton link={FF_NAV_PATHS.networkIdentitiesPath(ns, refID)} />
    ),
  },
  [FF_EVENTS.IDENTITY_UPDATED]: {
    category: EventCategoryEnum.BLOCKCHAIN,
    color: FFColors.Yellow,
    nicename: 'identityUpdated',
    enrichedEventKey: 'identity',
    enrichedEventString: (event: IEvent): string =>
      `${event.identity?.name}${
        event.identity?.did ? ', DID=' + event.identity?.did : ''
      }${event.identity?.type ? ', Type=' + event.identity?.type : ''}`,
    referenceIDName: 'identityID',
    referenceIDButton: (ns: string, refID: string): JSX.Element => (
      <LaunchButton link={FF_NAV_PATHS.networkIdentitiesPath(ns, refID)} />
    ),
  },
  [FF_EVENTS.NS_CONFIRMED]: {
    category: EventCategoryEnum.BLOCKCHAIN,
    color: FFColors.Yellow,
    nicename: 'namespaceConfirmed',
    enrichedEventKey: 'namespaceDetails',
    enrichedEventString: (event: IEvent): string =>
      `${event.namespaceDetails?.name} ${
        event.namespaceDetails?.type
          ? ', Type=' + event.namespaceDetails?.type
          : ''
      }`,
    referenceIDName: 'nsID',
    referenceIDButton: (ns: string, refID: string): JSX.Element => (
      <LaunchButton link={FF_NAV_PATHS.networkNamespacesPath(ns, refID)} />
    ),
  },
  // Message Events
  [FF_EVENTS.MSG_CONFIRMED]: {
    category: EventCategoryEnum.MESSAGES,
    color: FFColors.Orange,
    nicename: 'messageConfirmed',
    enrichedEventKey: 'message',
    enrichedEventString: (event: IEvent): string =>
      `Author=${event.message?.header?.author}, Topics=[${
        event.message?.header.topics.map((t) => getShortHash(t)).join(', ') ??
        ''
      }]${
        event.message?.header.tag ? ', Tag=' + event.message?.header.tag : ''
      }`,
    referenceIDName: 'messageID',
    referenceIDButton: (ns: string, refID: string): JSX.Element => (
      <LaunchButton link={FF_NAV_PATHS.offchainMessagesPath(ns, refID)} />
    ),
  },
  [FF_EVENTS.MSG_REJECTED]: {
    category: EventCategoryEnum.MESSAGES,
    color: FFColors.Orange,
    nicename: 'messageRejected',
    enrichedEventKey: 'message',
    enrichedEventString: (event: IEvent): string =>
      `Author=${event.message?.header?.author}, Topics=[${
        event.message?.header.topics.map((t) => getShortHash(t)).join(', ') ??
        ''
      }]${
        event.message?.header.tag ? ', Tag=' + event.message?.header.tag : ''
      }`,
    referenceIDName: 'messageID',
    referenceIDButton: (ns: string, refID: string): JSX.Element => (
      <LaunchButton link={FF_NAV_PATHS.offchainMessagesPath(ns, refID)} />
    ),
  },
  [FF_EVENTS.TX_SUBMITTED]: {
    category: EventCategoryEnum.MESSAGES,
    color: FFColors.Orange,
    nicename: 'transactionSubmitted',
    enrichedEventKey: 'transaction',
    enrichedEventString: (event: IEvent): string =>
      event.transaction?.blockchainIds?.length === 1
        ? `BlockchainID=${getShortHash(event.transaction?.blockchainIds[0])}`
        : event.transaction?.blockchainIds
        ? `BlockchainIDs=[${event.transaction?.blockchainIds
            ?.map((bid) => getShortHash(bid))
            .join(', ')}]`
        : t('transactionSubmitted'),
    referenceIDName: 'transactionID',
    referenceIDButton: (ns: string, refID: string): JSX.Element => (
      <LaunchButton link={FF_NAV_PATHS.activityTxDetailPath(ns, refID)} />
    ),
  },
  // Token Events
  [FF_EVENTS.TOKEN_POOL_CONFIRMED]: {
    category: EventCategoryEnum.TOKENS,
    color: FFColors.Pink,
    nicename: 'tokenPoolConfirmed',
    enrichedEventKey: 'tokenPool',
    enrichedEventString: (event: IEvent): string =>
      `${event.tokenPool?.name ?? ''}${
        event.tokenPool?.connector
          ? ', Connector=' + event.tokenPool?.connector
          : ''
      }${event.tokenPool?.type ? ', Type=' + event.tokenPool?.type : ''}`,
    referenceIDName: 'poolID',
    referenceIDButton: (ns: string, refID: string): JSX.Element => (
      <LaunchButton link={FF_NAV_PATHS.tokensPoolDetailsPath(ns, refID)} />
    ),
  },
  [FF_EVENTS.TOKEN_APPROVAL_CONFIRMED]: {
    category: EventCategoryEnum.TOKENS,
    color: FFColors.Pink,
    nicename: 'tokenApprovalConfirmed',
    enrichedEventKey: 'tokenApproval',
    enrichedEventString: (event: IEvent): string =>
      `Key=${getShortHash(
        event.tokenApproval?.key ?? ''
      )}, Operator=${getShortHash(event.tokenApproval?.operator ?? '')}`,
    referenceIDName: 'approvalID',
    referenceIDButton: (ns: string, refID: string): JSX.Element => (
      <LaunchButton link={FF_NAV_PATHS.tokensApprovalsPath(ns, refID)} />
    ),
  },
  [FF_EVENTS.TOKEN_APPROVAL_OP_FAILED]: {
    category: EventCategoryEnum.TOKENS,
    color: FFColors.Pink,
    nicename: 'tokenApprovalOpFailed',
    enrichedEventKey: 'tokenApproval',
    enrichedEventString: (event: IEvent): string =>
      `Key=${getShortHash(
        event.tokenApproval?.key ?? ''
      )}, Operator=${getShortHash(event.tokenApproval?.operator ?? '')}`,
    referenceIDName: 'approvalID',
    referenceIDButton: (ns: string, refID: string): JSX.Element => (
      <LaunchButton link={FF_NAV_PATHS.tokensApprovalsPath(ns, refID)} />
    ),
  },
  [FF_EVENTS.TOKEN_TRANSFER_CONFIRMED]: {
    category: EventCategoryEnum.TOKENS,
    color: FFColors.Pink,
    nicename: 'tokenTransferConfirmed',
    enrichedEventKey: 'tokenTransfer',
    enrichedEventString: (event: IEvent): string =>
      `${
        event.tokenTransfer?.type
          ? event.tokenTransfer?.type.charAt(0).toUpperCase() +
            event.tokenTransfer?.type.slice(1)
          : ''
      }, From=${
        event.tokenTransfer?.from
          ? getShortHash(event.tokenTransfer?.from)
          : getShortHash(t('nullAddress'))
      }, To=${
        event.tokenTransfer?.to
          ? getShortHash(event.tokenTransfer?.to)
          : getShortHash(t('nullAddress'))
      }, Amount=${event.tokenTransfer?.amount ?? ''}, Signer=${getShortHash(
        event.tokenTransfer?.key ?? ''
      )}`,
    referenceIDName: 'transferID',
    referenceIDButton: (ns: string, refID: string): JSX.Element => (
      <LaunchButton link={FF_NAV_PATHS.tokensTransfersPathLocalID(ns, refID)} />
    ),
  },
  [FF_EVENTS.TOKEN_TRANSFER_FAILED]: {
    category: EventCategoryEnum.TOKENS,
    color: FFColors.Pink,
    nicename: 'tokenTransferFailed',
    enrichedEventKey: 'tokenTransfer',
    enrichedEventString: (event: IEvent): string =>
      `${t('event')} ID=${event.id}`,
    referenceIDName: 'transferID',
    referenceIDButton: (ns: string, refID: string): JSX.Element => (
      <LaunchButton link={FF_NAV_PATHS.tokensTransfersPathLocalID(ns, refID)} />
    ),
  },
};
