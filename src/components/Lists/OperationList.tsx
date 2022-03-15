import { Chip } from '@mui/material';
import dayjs from 'dayjs';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import { IOperation, OpStatusColorMap } from '../../interfaces';
import { IDataListItem } from '../../interfaces/lists';
import { FFCopyButton } from '../Buttons/CopyButton';
import { TxButton } from '../Buttons/TxButton';
import { FFCircleLoader } from '../Loaders/FFCircleLoader';
import { FFListItem } from './ListItem';

interface Props {
  op?: IOperation;
  showTxLink?: boolean;
}

export const OperationList: React.FC<Props> = ({ op, showTxLink = true }) => {
  const { selectedNamespace } = useContext(ApplicationContext);
  const { t } = useTranslation();
  const [dataList, setDataList] = useState<IDataListItem[]>([]);

  useEffect(() => {
    if (op) {
      setDataList([
        {
          label: t('id'),
          value: op.id,
          button: <FFCopyButton value={op.id} />,
        },
        {
          label: t('transactionID'),
          value: op.tx,
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
          value: op.plugin,
        },
        {
          label: t('status'),
          value: op.status && (
            <Chip
              label={op.status?.toLocaleUpperCase()}
              sx={{ backgroundColor: OpStatusColorMap[op.status] }}
            ></Chip>
          ),
        },
        {
          label: t('updated'),
          value: dayjs(op.updated).format('MM/DD/YYYY h:mm A'),
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
          {dataList.map((d) => (
            <FFListItem key={d.label} item={d} />
          ))}
        </>
      )}
    </>
  );
};
