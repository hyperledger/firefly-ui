import { Chip } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import { ITokenPool, PoolStateColorMap } from '../../interfaces';
import { IDataListItem } from '../../interfaces/lists';
import { FFCopyButton } from '../Buttons/CopyButton';
import { PoolButton } from '../Buttons/PoolButton';
import { TxButton } from '../Buttons/TxButton';
import { FFCircleLoader } from '../Loaders/FFCircleLoader';
import { FFListItem } from './FFListItem';
import { FFListText } from './FFListText';
import { FFListTimestamp } from './FFListTimestamp';

interface Props {
  pool?: ITokenPool;
  showPoolLink?: boolean;
}

export const PoolList: React.FC<Props> = ({ pool, showPoolLink = true }) => {
  const { selectedNamespace } = useContext(ApplicationContext);
  const { t } = useTranslation();
  const [dataList, setDataList] = useState<IDataListItem[]>([]);

  useEffect(() => {
    if (pool) {
      setDataList([
        {
          label: t('id'),
          value: <FFListText color="primary" text={pool.id} />,
          button: <FFCopyButton value={pool.id} />,
        },
        {
          label: t('protocolID'),
          value: <FFListText color="primary" text={pool.protocolId} />,
          button: <FFCopyButton value={pool.protocolId} />,
        },
        {
          label: t('connector'),
          value: <FFListText color="primary" text={pool.connector} />,
          button: (
            <>
              {showPoolLink && (
                <PoolButton ns={selectedNamespace} poolID={pool.id} />
              )}
              <FFCopyButton value={pool.connector} />
            </>
          ),
        },
        {
          label: t('transactionID'),
          value: <FFListText color="primary" text={pool.tx.id} />,
          button: (
            <>
              <TxButton ns={selectedNamespace} txID={pool.tx.id} />
              <FFCopyButton value={pool.tx.id} />
            </>
          ),
        },
        {
          label: t('messageID'),
          value: pool.message ? (
            <FFListText color="primary" text={pool.message} />
          ) : (
            <FFListText color="secondary" text={t('noMessageInTransfer')} />
          ),
          button: pool.message ? (
            <FFCopyButton value={pool.message} />
          ) : undefined,
        },
        {
          label: t('state'),
          value: pool.state && (
            <Chip
              label={pool.state.toLocaleUpperCase()}
              sx={{ backgroundColor: PoolStateColorMap[pool.state] }}
            ></Chip>
          ),
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
          {dataList.map((d) => (
            <FFListItem key={d.label} item={d} />
          ))}
        </>
      )}
    </>
  );
};
