import dayjs from 'dayjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FF_EVENTS_CATEGORY_MAP, IEvent } from '../../../interfaces';
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
        title={t(FF_EVENTS_CATEGORY_MAP[event.type].nicename)}
        description={t(FF_EVENTS_CATEGORY_MAP[event.type].nicename)}
        timestamp={dayjs(event.created).format('MM/DD/YYYY h:mm A')}
        status={<HashPopover address={event.id} shortHash paper />}
        color={FF_EVENTS_CATEGORY_MAP[event.type].color}
        link={link}
        linkState={linkState}
      />
    </>
  );
};
