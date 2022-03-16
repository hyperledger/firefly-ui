import { Chip } from '@mui/material';
import dayjs from 'dayjs';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import { ITokenTransfer, ITxStatus, TxStatusColorMap } from '../../interfaces';
import { IDataListItem } from '../../interfaces/lists';
import { FFCopyButton } from '../Buttons/CopyButton';
import { PoolButton } from '../Buttons/PoolButton';
import { TxButton } from '../Buttons/TxButton';
import { FFCircleLoader } from '../Loaders/FFCircleLoader';
import { FFListItem } from './FFListItem';

interface Props {
  transfer?: ITokenTransfer;
  txStatus?: ITxStatus;
  showTxLink?: boolean;
  showPoolLink?: boolean;
}

export const TransferList: React.FC<Props> = ({
  transfer,
  txStatus,
  showTxLink = true,
  showPoolLink = true,
}) => {
  const { selectedNamespace } = useContext(ApplicationContext);
  const { t } = useTranslation();
  const [dataList, setDataList] = useState<IDataListItem[]>([]);

  useEffect(() => {
    if (transfer && txStatus) {
      setDataList([
        {
          label: t('localID'),
          value: transfer.localId,
          button: <FFCopyButton value={transfer.localId} />,
        },
        {
          label: t('poolID'),
          value: transfer.pool,
          button: (
            <>
              {showPoolLink && (
                <PoolButton ns={selectedNamespace} poolID={transfer.pool} />
              )}
              <FFCopyButton value={transfer.pool} />
            </>
          ),
        },
        {
          label: t('transactionID'),
          value: transfer.tx.id,
          button: (
            <>
              {showTxLink && (
                <TxButton ns={selectedNamespace} txID={transfer.tx.id} />
              )}
              <FFCopyButton value={transfer.tx.id} />
            </>
          ),
        },
        {
          label: t('authorKey'),
          value: transfer.key,
          button: <FFCopyButton value={transfer.key} />,
        },
        {
          label: t('messageID'),
          value: transfer.message ?? t('noMessageInTransfer'),
          button: transfer.message ? (
            <FFCopyButton value={transfer.message} />
          ) : undefined,
        },
        {
          label: t('status'),
          value: txStatus && (
            <Chip
              label={txStatus.status?.toLocaleUpperCase()}
              sx={{ backgroundColor: TxStatusColorMap[txStatus.status] }}
            ></Chip>
          ),
        },
        {
          label: t('created'),
          value: dayjs(transfer.created).format('MM/DD/YYYY h:mm A'),
        },
      ]);
    }
  }, [transfer, txStatus]);

  return (
    <>
      {!transfer ? (
        <FFCircleLoader color="warning" />
      ) : (
        <>
          {dataList.map((d) => (
            <FFListItem key={d.label} item={d} />
          ))}
        </>
      )}
    </>
  );
};
