import React from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { FF_EVENTS_CATEGORY_MAP, IEvent } from '../../../../interfaces';
import { HashPopover } from '../../../Popovers/HashPopover';
import { BaseCard } from '../BaseCard';

interface Props {
  event: IEvent;
}

export const EventCardWrapper = ({ event }: Props) => {
  const { t } = useTranslation();

  return (
    <>
      <BaseCard
        title="Event"
        description={t(FF_EVENTS_CATEGORY_MAP[event.type].nicename)}
        timestamp={dayjs(event.created).format('MM/DD/YYYY h:mm A')}
        status={<HashPopover address={event.id} shortHash paper />}
        color={FF_EVENTS_CATEGORY_MAP[event.type].color}
      />
    </>
  );
};
