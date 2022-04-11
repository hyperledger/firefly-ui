import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ISubscription } from '../../interfaces';
import { IDataListItem } from '../../interfaces/lists';
import { FFCopyButton } from '../Buttons/CopyButton';
import { FFListItem } from './FFListItem';
import { FFListText } from './FFListText';
import { FFSkeletonList } from './FFSkeletonList';

interface Props {
  options?: ISubscription['options'];
}

export const SubOptionsList: React.FC<Props> = ({ options }) => {
  const { t } = useTranslation();
  const [dataList, setDataList] = useState<IDataListItem[]>(FFSkeletonList);

  useEffect(() => {
    if (options) {
      setDataList([
        {
          label: t('firstEvent'),
          value: <FFListText color="primary" text={options.firstEvent} />,
          button: <FFCopyButton value={options.firstEvent} />,
        },
        {
          label: t('readAhead'),
          value: (
            <FFListText color="primary" text={options.readAhead.toString()} />
          ),
          button: <FFCopyButton value={options.readAhead.toString()} />,
        },
        {
          label: t('withData'),
          value: (
            <FFListText
              color="primary"
              text={options.withData ? t('yes') : t('no')}
            />
          ),
          button: (
            <FFCopyButton value={options.withData ? t('yes') : t('no')} />
          ),
        },
      ]);
    }
  }, [options]);

  return (
    <>
      {dataList.map((d, idx) => (
        <FFListItem key={idx} item={d} />
      ))}
    </>
  );
};
