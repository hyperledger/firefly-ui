import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  FF_EVENTS_CATEGORY_MAP,
  FF_TX_CATEGORY_MAP,
  getEnrichedEventText,
  IEvent,
} from '../../../interfaces';
import { getFFTime } from '../../../utils';
import { HashPopover } from '../../Popovers/HashPopover';
import { BaseCard } from './BaseCard';

interface Props {
  event: IEvent;
  link?: string;
  linkState?: any;
  onHandleViewEvent?: any;
  onHandleViewTx?: any;
}

export const EventCardWrapper = ({
  event,
  onHandleViewEvent,
  onHandleViewTx,
  link,
}: Props) => {
  const { t } = useTranslation();

  return (
    <BaseCard
      onClick={
        onHandleViewTx
          ? () => onHandleViewTx(event.transaction)
          : () => onHandleViewEvent(event)
      }
      title={
        event.transaction
          ? t(FF_TX_CATEGORY_MAP[event.transaction?.type]?.nicename)
          : t(t(FF_EVENTS_CATEGORY_MAP[event.type]?.nicename))
      }
      description={getEnrichedEventText(event)}
      timestamp={getFFTime(event.created)}
      status={<HashPopover address={event.id} shortHash paper />}
      color={FF_EVENTS_CATEGORY_MAP[event.type]?.color}
      link={link}
    />
  );
};
