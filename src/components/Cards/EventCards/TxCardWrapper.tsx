import dayjs from 'dayjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ITransaction } from '../../../interfaces';
import { FF_TX_CATEGORY_MAP } from '../../../interfaces/enums/transactionTypes';
import { HashPopover } from '../../Popovers/HashPopover';
import { BaseCard } from './BaseCard';

interface Props {
  tx: ITransaction;
}

export const TxCardWrapper = ({ tx }: Props) => {
  const { t } = useTranslation();

  return (
    <>
      <BaseCard
        title={t(FF_TX_CATEGORY_MAP[tx.type].nicename)}
        description={t(FF_TX_CATEGORY_MAP[tx.type].nicename)}
        timestamp={dayjs(tx.created).format('MM/DD/YYYY h:mm A')}
        status={<HashPopover address={tx.id} shortHash paper />}
        color={FF_TX_CATEGORY_MAP[tx.type].color}
      />
    </>
  );
};
