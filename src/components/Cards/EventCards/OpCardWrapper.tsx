import dayjs from 'dayjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FF_OP_CATEGORY_MAP, IOperation } from '../../../interfaces';
import { HashPopover } from '../../Popovers/HashPopover';
import { BaseCard } from './BaseCard';

interface Props {
  op: IOperation;
}

export const OpCardWrapper = ({ op }: Props) => {
  const { t } = useTranslation();

  return (
    <>
      <BaseCard
        title={t(FF_OP_CATEGORY_MAP[op.type].nicename)}
        description={t(FF_OP_CATEGORY_MAP[op.type].nicename)}
        timestamp={dayjs(op.created).format('MM/DD/YYYY h:mm A')}
        status={<HashPopover address={op.id} shortHash paper />}
        color={FF_OP_CATEGORY_MAP[op.type].color}
      />
    </>
  );
};
