import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { INamespace } from '../../interfaces';
import { IDataListItem } from '../../interfaces/lists';
import { FFCopyButton } from '../Buttons/CopyButton';
import { MsgButton } from '../Buttons/MsgButton';
import { FFListItem } from './FFListItem';
import { FFListText } from './FFListText';
import { FFListTimestamp } from './FFListTimestamp';
import { FFSkeletonList } from './FFSkeletonList';

interface Props {
  ns?: INamespace;
}

export const NamespaceList: React.FC<Props> = ({ ns }) => {
  const { t } = useTranslation();
  const [dataList, setDataList] = useState<IDataListItem[]>(FFSkeletonList);

  useEffect(() => {
    ns &&
      setDataList([
        {
          label: t('id'),
          value: <FFListText text={ns.id} color="primary" />,
          button: <FFCopyButton value={ns.id} />,
        },
        {
          label: t('description'),
          value: (
            <FFListText
              color="secondary"
              text={ns.description.length ? ns.description : t('noDescription')}
            />
          ),
        },
        {
          label: t('type'),
          value: <FFListText text={ns.type} color="primary" />,
        },
        {
          label: t('messageID'),
          value: ns.message ? (
            <FFListText text={ns.message} color="primary" />
          ) : (
            <FFListText color="secondary" text={t('noMessageID')} />
          ),
          button: ns.message ? (
            <>
              <MsgButton msgID={ns.message} />
              <FFCopyButton value={ns.message} />
            </>
          ) : (
            <></>
          ),
        },
        {
          label: t('created'),
          value: <FFListTimestamp ts={ns.created} />,
        },
      ]);
  }, [ns]);

  return (
    <>
      {dataList.map((d, idx) => (
        <FFListItem key={idx} item={d} />
      ))}
    </>
  );
};
