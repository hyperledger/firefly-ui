import { Chip } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import { ITokenTransfer, ITxStatus, TxStatusColorMap } from '../../interfaces';
import { IDataListItem } from '../../interfaces/lists';
import { FFCopyButton } from '../Buttons/CopyButton';
import { MsgButton } from '../Buttons/MsgButton';
import { PoolButton } from '../Buttons/PoolButton';
import { TxButton } from '../Buttons/TxButton';
import { FFCircleLoader } from '../Loaders/FFCircleLoader';
import { FFListItem } from './FFListItem';
import { FFListText } from './FFListText';
import { FFListTimestamp } from './FFListTimestamp';
import { FFSkeletonList } from './FFSkeletonList';

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
  const [dataList, setDataList] = useState<IDataListItem[]>(FFSkeletonList);

  useEffect(() => {
    if (transfer) {
      setDataList([
        {
          label: t('localID'),
          value: <FFListText color="primary" text={transfer.localId} />,
          button: <FFCopyButton value={transfer.localId} />,
        },
        {
          label: t('transactionID'),
          value: transfer.tx.id ? (
            <FFListText color="primary" text={transfer.tx.id} />
          ) : (
            <FFListText
              color="secondary"
              text={t('transactionIDUnavailable')}
            />
          ),
          button: transfer.tx.id ? (
            <>
              {showTxLink && (
                <TxButton ns={selectedNamespace} txID={transfer.tx.id} />
              )}
              <FFCopyButton value={transfer.tx.id} />
            </>
          ) : undefined,
        },
        {
          label: t('author'),
          value: <FFListText color="primary" text={transfer.key} />,
          button: <FFCopyButton value={transfer.key} />,
        },
        {
          label: t('from'),
          value: transfer.from ? (
            <FFListText color="primary" text={transfer.from} />
          ) : (
            <FFListText color="secondary" text={t('nullAddress')} />
          ),
          button: transfer.from ? (
            <FFCopyButton value={transfer.from} />
          ) : undefined,
        },
        {
          label: t('to'),
          value: transfer.to ? (
            <FFListText color="primary" text={transfer.to} />
          ) : (
            <FFListText color="secondary" text={t('nullAddress')} />
          ),
          button: transfer.to ? (
            <FFCopyButton value={transfer.to} />
          ) : undefined,
        },
        {
          label: t('amount'),
          value: <FFListText color="primary" text={transfer.amount} />,
          button: <FFCopyButton value={transfer.amount} />,
        },
        {
          label: t('messageID'),
          value: transfer.message ? (
            <FFListText color="primary" text={transfer.message} />
          ) : (
            <FFListText color="secondary" text={t('noMessageInTransfer')} />
          ),
          button: transfer.message ? (
            <>
              <MsgButton ns={selectedNamespace} msgID={transfer.message} />
              <FFCopyButton value={transfer.message} />
            </>
          ) : undefined,
        },
        {
          label: t('poolID'),
          value: <FFListText color="primary" text={transfer.pool} />,
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
          value: <FFListTimestamp ts={transfer.created} />,
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
          {dataList.map((d, idx) => (
            <FFListItem key={idx} item={d} />
          ))}
        </>
      )}
    </>
  );
};
