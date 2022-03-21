import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IData } from '../../interfaces';
import { IDataListItem } from '../../interfaces/lists';
import { FFCopyButton } from '../Buttons/CopyButton';
import { FFCircleLoader } from '../Loaders/FFCircleLoader';
import { FFListItem } from './FFListItem';
import { FFListText } from './FFListText';
import { FFListTimestamp } from './FFListTimestamp';
import { FFSkeletonList } from './FFSkeletonList';

interface Props {
  data?: IData;
}

export const DataList: React.FC<Props> = ({ data }) => {
  const { t } = useTranslation();
  const [dataList, setDataList] = useState<IDataListItem[]>(FFSkeletonList);

  useEffect(() => {
    if (data) {
      setDataList([
        {
          label: t('id'),
          value: <FFListText color="primary" text={data.id} />,
          button: <FFCopyButton value={data.id} />,
        },
        {
          label: t('hash'),
          value: <FFListText color="primary" text={data.hash} />,
          button: <FFCopyButton value={data.hash} />,
        },
        {
          label: t('validator'),
          value: <FFListText color="primary" text={data.validator} />,
        },
        {
          label: t('created'),
          value: <FFListTimestamp ts={data.created} />,
        },
      ]);
    }
  }, [data]);

  return (
    <>
      {!data ? (
        <FFCircleLoader color="warning" />
      ) : (
        <>
          {dataList.map((d, idx) => (
            <FFListItem key={idx} item={d} />
          ))}
        </>
      )}
    </>
  );
};
