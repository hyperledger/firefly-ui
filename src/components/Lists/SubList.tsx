import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ISubscription } from '../../interfaces';
import { IDataListItem } from '../../interfaces/lists';
import { FFCopyButton } from '../Buttons/CopyButton';
import { FFListItem } from './FFListItem';
import { FFListText } from './FFListText';
import { FFListTimestamp } from './FFListTimestamp';
import { FFSkeletonList } from './FFSkeletonList';

interface Props {
  sub?: ISubscription;
}

export const SubList: React.FC<Props> = ({ sub }) => {
  const { t } = useTranslation();
  const [dataList, setDataList] = useState<IDataListItem[]>(FFSkeletonList);

  useEffect(() => {
    if (sub) {
      setDataList([
        {
          label: t('id'),
          value: <FFListText color="primary" text={sub.id} />,
          button: <FFCopyButton value={sub.id} />,
        },
        {
          label: t('transport'),
          value: <FFListText color="primary" text={sub.transport} />,
        },
        {
          label: t('created'),
          value: <FFListTimestamp ts={sub.created} />,
        },
      ]);
    }
  }, [sub]);

  return (
    <>
      {dataList.map((d, idx) => (
        <FFListItem key={idx} item={d} />
      ))}
    </>
  );
};
