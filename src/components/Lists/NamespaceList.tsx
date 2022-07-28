import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { INamespace } from '../../interfaces';
import { IDataListItem } from '../../interfaces/lists';
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
          label: t('remoteName'),
          value: <FFListText color="secondary" text={ns.remoteName} />,
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
