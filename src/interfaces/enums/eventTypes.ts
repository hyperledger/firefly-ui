import { t } from 'i18next';
import { FFColors } from '../../theme';
import { getShortHash } from '../../utils';
import { IEvent } from '../api';

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
}

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
      `${event.blockchainevent?.name}${
        event.blockchainevent?.protocolId
          ? ', Protocol ID=' + getShortHash(event.blockchainevent?.protocolId)
          : ''
      }`,
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
  },
  [FF_EVENTS.TX_SUBMITTED]: {
    category: EventCategoryEnum.MESSAGES,
    color: FFColors.Orange,
    nicename: 'transactionSubmitted',
    enrichedEventKey: 'transaction',
    enrichedEventString: (event: IEvent): string =>
      event.transaction?.blockchainIds?.length === 1
        ? `BlockchainID=${getShortHash(event.transaction?.blockchainIds[0])}`
        : `BlockchainIDs=[${event.transaction?.blockchainIds
            ?.map((bid) => getShortHash(bid))
            .join(', ')}]`,
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
  },
  [FF_EVENTS.TOKEN_TRANSFER_FAILED]: {
    category: EventCategoryEnum.TOKENS,
    color: FFColors.Pink,
    nicename: 'tokenTransferFailed',
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
  },
};
