import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import { ITokenPool } from '../../interfaces';
import { IDataListItem } from '../../interfaces/lists';
import { FFCopyButton } from '../Buttons/CopyButton';
import { MsgButton } from '../Buttons/MsgButton';
import { TxButton } from '../Buttons/TxButton';
import { PoolStatusChip } from '../Chips/PoolStatusChip';
import { FFListItem } from './FFListItem';
import { FFListText } from './FFListText';
import { FFListTimestamp } from './FFListTimestamp';
import { FFSkeletonList } from './FFSkeletonList';

interface Props {
  pool?: ITokenPool;
}

export const PoolList: React.FC<Props> = ({ pool }) => {
  const { selectedNamespace } = useContext(ApplicationContext);
  const { t } = useTranslation();
  const [dataList, setDataList] = useState<IDataListItem[]>(FFSkeletonList);

  useEffect(() => {
    if (pool) {
      setDataList([
        {
          label: t('id'),
          value: <FFListText color="primary" text={pool.id} />,
          button: <FFCopyButton value={pool.id} />,
        },
        {
          label: t('standard'),
          value: (
            <>
              <FFListText
                color="primary"
                text={`${pool.standard} (${pool.type})`}
              />
            </>
          ),
          button: <FFCopyButton value={pool.standard} />,
        },
        {
          label: t('connector'),
          value: <FFListText color="primary" text={pool.connector} />,
          button: <FFCopyButton value={pool.connector} />,
        },
        {
          label: t('locator'),
          value: <FFListText color="primary" text={pool.locator} />,
          button: <FFCopyButton value={pool.locator} />,
        },
        {
          label: pool.decimals ? t('decimals') : '',
          value: pool.decimals ? (
            <FFListText color="primary" text={pool.decimals.toString()} />
          ) : (
            <></>
          ),
          button: pool.decimals ? (
            <FFCopyButton value={pool.decimals.toString()} />
          ) : (
            <></>
          ),
        },
        {
          label: t('transactionID'),
          value: pool.tx?.id ? (
            <FFListText color="primary" text={pool.tx.id} />
          ) : (
            <FFListText
              color="secondary"
              text={t('transactionIDUnavailable')}
            />
          ),
          button: pool.tx?.id ? (
            <>
              <TxButton ns={selectedNamespace} txID={pool.tx.id} />
              <FFCopyButton value={pool.tx.id} />
            </>
          ) : undefined,
        },
        {
          label: t('messageID'),
          value: pool.message ? (
            <FFListText color="primary" text={pool.message} />
          ) : (
            <FFListText color="secondary" text={t('noMessageInTransfer')} />
          ),
          button: pool.message ? (
            <>
              <MsgButton ns={selectedNamespace} msgID={pool.message} />
              <FFCopyButton value={pool.message} />
            </>
          ) : undefined,
        },
        {
          label: t('state'),
          value: <PoolStatusChip pool={pool} />,
        },
        {
          label: t('created'),
          value: <FFListTimestamp ts={pool.created} />,
        },
      ]);
    }
  }, [pool]);

  return (
    <>
      {dataList.map(
        (d, idx) => d.label !== '' && <FFListItem key={idx} item={d} />
      )}
    </>
  );
};
