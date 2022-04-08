import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import { ITokenPool } from '../../interfaces';
import { IDataListItem } from '../../interfaces/lists';
import { FFCopyButton } from '../Buttons/CopyButton';
import { MsgButton } from '../Buttons/MsgButton';
import { TxButton } from '../Buttons/TxButton';
import { PoolStatusChip } from '../Chips/PoolStatusChip';
import { FFCircleLoader } from '../Loaders/FFCircleLoader';
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
          value: pool.state && <PoolStatusChip pool={pool} />,
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
      {!pool ? (
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
