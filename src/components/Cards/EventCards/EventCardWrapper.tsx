import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  FF_EVENTS_CATEGORY_MAP,
  FF_TX_CATEGORY_MAP,
  IEvent,
} from '../../../interfaces';
import { getFFTime } from '../../../utils';
import { HashPopover } from '../../Popovers/HashPopover';
import { BaseCard } from './BaseCard';

interface Props {
  event: IEvent;
  link?: string;
  linkState?: any;
  onHandleViewEvent: any;
  onHandleViewTx: any;
}

export const EventCardWrapper = ({
  event,
  onHandleViewEvent,
  onHandleViewTx,
  link,
  linkState,
}: Props) => {
  const { t } = useTranslation();

  return (
    <>
      <BaseCard
        onClick={
          event.transaction
            ? () => onHandleViewTx(event.transaction)
            : () => onHandleViewEvent(event)
        }
        title={t(FF_EVENTS_CATEGORY_MAP[event.type]?.nicename)}
        description={
          event.transaction
            ? t(FF_TX_CATEGORY_MAP[event.transaction?.type]?.nicename)
            : t('event')
        }
        timestamp={getFFTime(event.created)}
        status={<HashPopover address={event.id} shortHash paper />}
        color={FF_EVENTS_CATEGORY_MAP[event.type]?.color}
        link={link}
        linkState={linkState}
      />
    </>
  );
};
