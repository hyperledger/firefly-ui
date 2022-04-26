import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IWebsocketConnection } from '../../interfaces';
import { IDataListItem } from '../../interfaces/lists';
import { FFCopyButton } from '../Buttons/CopyButton';
import { FFListItem } from './FFListItem';
import { FFListText } from './FFListText';
import { FFSkeletonList } from './FFSkeletonList';

interface Props {
  ws?: IWebsocketConnection;
}

export const WebsocketList: React.FC<Props> = ({ ws }) => {
  const { t } = useTranslation();
  const [dataList, setDataList] = useState<IDataListItem[]>(FFSkeletonList);

  useEffect(() => {
    if (ws) {
      setDataList([
        {
          label: t('id'),
          value: <FFListText color="primary" text={ws.id} />,
          button: <FFCopyButton value={ws.id} />,
        },
        {
          label: t('remoteAddress'),
          value: <FFListText color="primary" text={ws.remoteAddress} />,
          button: <FFCopyButton value={ws.remoteAddress} />,
        },
        {
          label: t('userAgent'),
          value: ws.userAgent.length ? (
            <FFListText color="primary" text={ws.userAgent} />
          ) : (
            <FFListText color="secondary" text={t('notSpecified')} />
          ),
          button: ws.userAgent.length ? <FFCopyButton value={ws.id} /> : <></>,
        },
      ]);
    }
  }, [ws]);

  return (
    <>
      {dataList.map((d, idx) => (
        <FFListItem key={idx} item={d} />
      ))}
    </>
  );
};
