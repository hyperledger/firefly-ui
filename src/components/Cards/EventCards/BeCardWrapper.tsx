import dayjs from 'dayjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { IBlockchainEvent } from '../../../interfaces';
import {
  BlockchainEventCategoryEnum,
  FF_BE_CATEGORY_MAP,
} from '../../../interfaces/enums/blockchainEventTypes';
import { HashPopover } from '../../Popovers/HashPopover';
import { BaseCard } from './BaseCard';

interface Props {
  be: IBlockchainEvent;
}

export const BeCardWrapper = ({ be }: Props) => {
  const { t } = useTranslation();
  return (
    <>
      <BaseCard
        title={t(
          FF_BE_CATEGORY_MAP[BlockchainEventCategoryEnum.BLOCKCHAINEVENT]
            .nicename
        )}
        description={t(
          FF_BE_CATEGORY_MAP[BlockchainEventCategoryEnum.BLOCKCHAINEVENT]
            .nicename
        )}
        timestamp={dayjs(be.timestamp).format('MM/DD/YYYY h:mm A')}
        status={<HashPopover address={be.id} shortHash paper />}
        color={
          FF_BE_CATEGORY_MAP[BlockchainEventCategoryEnum.BLOCKCHAINEVENT].color
        }
      />
    </>
  );
};
