import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IContractListener } from '../../interfaces';
import { IDataListItem } from '../../interfaces/lists';
import { FFCopyButton } from '../Buttons/CopyButton';
import { FFCircleLoader } from '../Loaders/FFCircleLoader';
import { FFListItem } from './FFListItem';
import { FFListText } from './FFListText';
import { FFListTimestamp } from './FFListTimestamp';

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
          value: <FFListText color="primary" text={listener.id} />,
          button: <FFCopyButton value={listener.id} />,
        },
        {
          label: t('interfaceID'),
          value: <FFListText color="primary" text={listener.interface.id} />,
          button: <FFCopyButton value={listener.interface.id} />,
        },
        {
          label: t('protocolID'),
          value: <FFListText color="primary" text={listener.protocolId} />,
          button: <FFCopyButton value={listener.protocolId} />,
        },
        {
          label: t('address'),
          value: listener.location?.address ? (
            <FFListText color="primary" text={listener.location.address} />
          ) : (
            <FFListText color="secondary" text={t('noAddressForListener')} />
          ),
          button: listener.location?.address ? (
            <FFCopyButton value={listener.location.address} />
          ) : undefined,
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
