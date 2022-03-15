import { Chip, Typography } from '@mui/material';
import dayjs from 'dayjs';
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
  const [dataList, setDataList] = useState<IDataListItem[]>([]);

  useEffect(() => {
    if (tx && txStatus) {
      setDataList([
        {
          label: t('id'),
          value: tx.id,
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
                  <HashPopover key={id} shortHash address={id} />
                ))
              ) : (
                <Typography>{t('noBlockchainIds')} </Typography>
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
          value: dayjs(tx.created).format('MM/DD/YYYY h:mm A'),
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
          label: t(FF_TX_STATUS_CATEGORY_MAP[type.type].nicename),
          value: type.id,
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
          {dataList.map((d) => (
            <FFListItem key={d.label} item={d} />
          ))}
          {txDetails?.map(
            (d) => d !== undefined && <FFListItem key={d.label} item={d} />
          )}
        </>
      )}
    </>
  );
};