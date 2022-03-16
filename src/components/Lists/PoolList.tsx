import { Chip } from '@mui/material';
import dayjs from 'dayjs';
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
          value: pool.id,
          button: <FFCopyButton value={pool.id} />,
        },
        {
          label: t('protocolID'),
          value: pool.protocolId,
          button: <FFCopyButton value={pool.protocolId} />,
        },
        {
          label: t('connector'),
          value: pool.connector,
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
          value: pool.tx.id,
          button: (
            <>
              <TxButton ns={selectedNamespace} txID={pool.tx.id} />
              <FFCopyButton value={pool.tx.id} />
            </>
          ),
        },
        {
          label: t('messageID'),
          value: pool.message ?? t('noMessageInTransfer'),
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
          value: dayjs(pool.created).format('MM/DD/YYYY h:mm A'),
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
