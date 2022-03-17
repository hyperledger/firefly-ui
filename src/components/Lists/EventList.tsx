import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import { IEvent } from '../../interfaces';
import { IDataListItem } from '../../interfaces/lists';
import { FFCopyButton } from '../Buttons/CopyButton';
import { TxButton } from '../Buttons/TxButton';
import { FFCircleLoader } from '../Loaders/FFCircleLoader';
import { FFListItem } from './FFListItem';
import { FFListText } from './FFListText';
import { FFListTimestamp } from './FFListTimestamp';

interface Props {
  event?: IEvent;
  showTxLink?: boolean;
}

export const EventList: React.FC<Props> = ({ event, showTxLink = true }) => {
  const { selectedNamespace } = useContext(ApplicationContext);
  const { t } = useTranslation();
  const [dataList, setDataList] = useState<IDataListItem[]>([]);

  useEffect(() => {
    if (event) {
      setDataList([
        {
          label: t('id'),
          value: <FFListText color="primary" text={event.id} />,
          button: <FFCopyButton value={event.id} />,
        },
        {
          label: t('transactionID'),
          value: <FFListText color="primary" text={event.tx} />,
          button: (
            <>
              {showTxLink && (
                <TxButton ns={selectedNamespace} txID={event.tx} />
              )}
              <FFCopyButton value={event.tx} />
            </>
          ),
        },
        {
          label: t('referenceID'),
          value: <FFListText color="primary" text={event.reference} />,
          button: <FFCopyButton value={event.reference} />,
        },
        {
          label: t('created'),
          value: <FFListTimestamp ts={event.created} />,
        },
      ]);
    }
  }, [event]);

  return (
    <>
      {!event ? (
        <FFCircleLoader color="warning" />
      ) : (
        dataList.map((d) => <FFListItem key={d.label} item={d} />)
      )}
    </>
  );
};
