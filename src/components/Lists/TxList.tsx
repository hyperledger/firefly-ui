import { Chip } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import { ITransaction, ITxStatus, TxStatusColorMap } from '../../interfaces';
import {
  FF_TX_STATUS,
  FF_TX_STATUS_CATEGORY_MAP,
} from '../../interfaces/enums/txStatusTypes';
import { IDataListItem } from '../../interfaces/lists';
import { FFCopyButton } from '../Buttons/CopyButton';
import { TxButton } from '../Buttons/TxButton';
import { FFCircleLoader } from '../Loaders/FFCircleLoader';
import { HashPopover } from '../Popovers/HashPopover';
import { FFListItem } from './FFListItem';
import { FFListText } from './FFListText';
import { FFListTimestamp } from './FFListTimestamp';
import { FFSkeletonList } from './FFSkeletonList';

interface Props {
  tx?: ITransaction;
  txStatus?: ITxStatus;
  showTxLink?: boolean;
}

export const TxList: React.FC<Props> = ({
  tx,
  txStatus,
  showTxLink = true,
}) => {
  const { selectedNamespace } = useContext(ApplicationContext);
  const { t } = useTranslation();
  const [dataList, setDataList] = useState<IDataListItem[]>(FFSkeletonList);

  useEffect(() => {
    if (tx && txStatus) {
      setDataList([
        {
          label: t('id'),
          value: <FFListText color="primary" text={tx.id} />,
          button: (
            <>
              {showTxLink && <TxButton ns={selectedNamespace} txID={tx.id} />}
              <FFCopyButton value={tx.id} />
            </>
          ),
        },
        {
          label:
            tx.blockchainIds?.length === 1
              ? t('blockchainId')
              : t('blockchainIds'),
          value: (
            <>
              {tx.blockchainIds ? (
                tx.blockchainIds.map((id) => (
                  <HashPopover paper key={id} shortHash address={id} />
                ))
              ) : (
                <FFListText color="secondary" text={t('noBlockchainIds')} />
              )}
            </>
          ),
        },
        {
          label: t('status'),
          value: txStatus && (
            <Chip
              label={txStatus.status?.toLocaleUpperCase()}
              sx={{ backgroundColor: TxStatusColorMap[txStatus.status] }}
            />
          ),
        },
        {
          label: t('created'),
          value: <FFListTimestamp ts={tx.created} />,
        },
      ]);
    }
  }, [tx, txStatus]);

  const txDetails = txStatus?.details
    .map((type) => {
      if (
        type.type !== FF_TX_STATUS.BLOCKCHAIN_EVENT &&
        type.type !== FF_TX_STATUS.OPERATION
      ) {
        return {
          label: t(FF_TX_STATUS_CATEGORY_MAP[type.type]?.nicename),
          value: <FFListText color="primary" text={type.id} />,
          button: (
            <>
              <FFCopyButton value={type.id} />
            </>
          ),
        };
      }
    })
    .filter((d) => d !== undefined);

  return (
    <>
      {!tx || !txStatus ? (
        <FFCircleLoader color="warning" />
      ) : (
        <>
          {dataList.map((d, idx) => (
            <FFListItem key={idx} item={d} />
          ))}
          {txDetails?.map(
            (d) => d !== undefined && <FFListItem key={d.label} item={d} />
          )}
        </>
      )}
    </>
  );
};
