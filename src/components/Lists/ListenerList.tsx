import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IContractListener } from '../../interfaces';
import { IDataListItem } from '../../interfaces/lists';
import { FFCopyButton } from '../Buttons/CopyButton';
import { FFCircleLoader } from '../Loaders/FFCircleLoader';
import { FFListItem } from './FFListItem';

interface Props {
  listener: IContractListener;
}

export const ListenerList: React.FC<Props> = ({ listener }) => {
  const { t } = useTranslation();
  const [dataList, setDataList] = useState<IDataListItem[]>([]);

  useEffect(() => {
    if (listener) {
      setDataList([
        {
          label: t('id'),
          value: listener.id,
          button: <FFCopyButton value={listener.id} />,
        },
        {
          label: t('interfaceID'),
          value: listener.interface.id,
          button: <FFCopyButton value={listener.interface.id} />,
        },
        {
          label: t('protocolID'),
          value: listener.protocolId,
          button: <FFCopyButton value={listener.protocolId} />,
        },
        {
          label: t('address'),
          value: listener.location?.address ?? '',
          button: <FFCopyButton value={listener.location?.address ?? ''} />,
        },
        {
          label: t('description'),
          value: listener.event.description?.length
            ? listener.event.description
            : t('noDescriptionForListener').toString(),
        },
        {
          label: t('created'),
          value: dayjs(listener.created).format('MM/DD/YYYY h:mm A'),
        },
      ]);
    }
  }, [listener]);

  return (
    <>
      {!listener ? (
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
