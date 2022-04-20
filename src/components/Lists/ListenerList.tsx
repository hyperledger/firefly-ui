import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IContractListener } from '../../interfaces';
import { IDataListItem } from '../../interfaces/lists';
import { FFCopyButton } from '../Buttons/CopyButton';
import { FFListItem } from './FFListItem';
import { FFListText } from './FFListText';
import { FFListTimestamp } from './FFListTimestamp';
import { FFSkeletonList } from './FFSkeletonList';

interface Props {
  listener: IContractListener;
}

export const ListenerList: React.FC<Props> = ({ listener }) => {
  const { t } = useTranslation();
  const [dataList, setDataList] = useState<IDataListItem[]>(FFSkeletonList);

  useEffect(() => {
    if (listener) {
      setDataList([
        {
          label: t('id'),
          value: <FFListText color="primary" text={listener.id} />,
          button: <FFCopyButton value={listener.id} />,
        },
        {
          label: t('signature'),
          value: <FFListText color="primary" text={listener.signature} />,
          button: <FFCopyButton value={listener.signature} />,
        },
        {
          label: t('topic'),
          value: <FFListText color="primary" text={listener.topic} />,
          button: <FFCopyButton value={listener.topic} />,
        },
        {
          label: listener.interface.id ? t('interfaceID') : '',
          value: listener.interface.id && (
            <FFListText color="primary" text={listener.interface.id} />
          ),
          button: listener.interface.id ? (
            <FFCopyButton value={listener.topic} />
          ) : (
            <></>
          ),
        },
        {
          label: t('backendId'),
          value: <FFListText color="primary" text={listener.backendId} />,
          button: <FFCopyButton value={listener.backendId} />,
        },
        {
          label: t('description'),
          value: listener.event.description?.length ? (
            <FFListText color="primary" text={listener.event.description} />
          ) : (
            <FFListText
              color="secondary"
              text={t('noDescriptionForListener')}
            />
          ),
        },
        {
          label: t('created'),
          value: <FFListTimestamp ts={listener.created} />,
        },
      ]);
    }
  }, [listener]);

  return (
    <>
      {dataList.map(
        (d, idx) => d.label !== '' && <FFListItem key={idx} item={d} />
      )}
    </>
  );
};
