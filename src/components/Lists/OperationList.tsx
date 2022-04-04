import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import { IOperation } from '../../interfaces';
import { IDataListItem } from '../../interfaces/lists';
import { FFCopyButton } from '../Buttons/CopyButton';
import { OpRetryButton } from '../Buttons/OpRetryButton';
import { TxButton } from '../Buttons/TxButton';
import { OpStatusChip } from '../Chips/OpStatusChip';
import { FFCircleLoader } from '../Loaders/FFCircleLoader';
import { FFListItem } from './FFListItem';
import { FFListText } from './FFListText';
import { FFListTimestamp } from './FFListTimestamp';
import { FFSkeletonList } from './FFSkeletonList';

interface Props {
  op?: IOperation;
  showTxLink?: boolean;
}

export const OperationList: React.FC<Props> = ({ op, showTxLink = true }) => {
  const { selectedNamespace } = useContext(ApplicationContext);
  const { t } = useTranslation();
  const [dataList, setDataList] = useState<IDataListItem[]>(FFSkeletonList);

  useEffect(() => {
    if (op) {
      setDataList([
        {
          label: t('id'),
          value: <FFListText color="primary" text={op.id} />,
          button: <FFCopyButton value={op.id} />,
        },
        {
          label: t('transactionID'),
          value: <FFListText color="primary" text={op.tx} />,
          button: (
            <>
              {showTxLink && (
                <TxButton ns={selectedNamespace} txID={op.tx ?? ''} />
              )}
              <FFCopyButton value={op.tx ?? ''} />
            </>
          ),
        },
        {
          label: t('plugin'),
          value: <FFListText color="primary" text={op.plugin} />,
        },
        {
          label: t('status'),
          value: op.status && <OpStatusChip op={op} />,
        },
        {
          label: op.retry ? t('retriedOperation') : '',
          value: op.retry ? <FFListText color="primary" text={op.retry} /> : '',
          button: (
            <>
              {op.retry && <OpRetryButton retryOpID={op.retry} />}
              <FFCopyButton value={op.tx ?? ''} />
            </>
          ),
        },
        {
          label: t('updated'),
          value: <FFListTimestamp ts={op.updated} />,
        },
      ]);
    }
  }, [op]);

  return (
    <>
      {!op ? (
        <FFCircleLoader color="warning" />
      ) : (
        <>
          {dataList.map(
            (d, idx) => d.label !== '' && <FFListItem key={idx} item={d} />
          )}
        </>
      )}
    </>
  );
};
