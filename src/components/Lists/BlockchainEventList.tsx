import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import { FF_TX_CATEGORY_MAP, IBlockchainEvent } from '../../interfaces';
import { IDataListItem } from '../../interfaces/lists';
import { FFCopyButton } from '../Buttons/CopyButton';
import { TxButton } from '../Buttons/TxButton';
import { FFListItem } from './FFListItem';
import { FFListText } from './FFListText';
import { FFListTimestamp } from './FFListTimestamp';
import { FFSkeletonList } from './FFSkeletonList';

interface Props {
  be?: IBlockchainEvent;
}

export const BlockchainEventList: React.FC<Props> = ({ be }) => {
  const { selectedNamespace } = useContext(ApplicationContext);
  const { t } = useTranslation();
  const [dataList, setDataList] = useState<IDataListItem[]>(FFSkeletonList);

  useEffect(() => {
    if (be) {
      setDataList([
        {
          label: t('id'),
          value: <FFListText color="primary" text={be.id} />,
        },
        {
          label: t('source'),
          value: <FFListText color="primary" text={be.source} />,
          button: <FFCopyButton value={be.source} />,
        },
        {
          label: t('protocolID'),
          value: <FFListText color="primary" text={be.protocolId} />,
          button: <FFCopyButton value={be.protocolId} />,
        },
        {
          label: be.tx?.blockchainId ? t('blockchainTransaction') : '',
          value: be.tx?.blockchainId && (
            <FFListText color="primary" text={be.tx.blockchainId} />
          ),
          button: be.tx?.blockchainId ? (
            <FFCopyButton value={be.tx?.blockchainId} />
          ) : (
            <></>
          ),
        },
        {
          label: be.tx?.type ? t('transactionType') : '',
          value: be.tx?.type && (
            <FFListText
              color="primary"
              text={t(FF_TX_CATEGORY_MAP[be.tx.type].nicename)}
            />
          ),
        },
        {
          label: be.tx?.id ? t('transactionID') : '',
          value: be.tx?.id && <FFListText color="primary" text={be.tx.id} />,
          button: be.tx?.id ? (
            <>
              <TxButton ns={selectedNamespace} txID={be.tx.id} />
              <FFCopyButton value={be.tx.id} />
            </>
          ) : undefined,
        },
        {
          label: t('timestamp'),
          value: <FFListTimestamp ts={be.timestamp} />,
        },
      ]);
    }
  }, [be]);

  return (
    <>
      {dataList.map(
        (d, idx) => d.label !== '' && <FFListItem key={idx} item={d} />
      )}
    </>
  );
};
