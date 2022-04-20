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
          label: options.firstEvent ? t('firstEvent') : '',
          value: options.firstEvent && (
            <FFListText color="primary" text={options.firstEvent} />
          ),
          button: options.firstEvent ? (
            <FFCopyButton value={options.firstEvent} />
          ) : (
            <></>
          ),
        },
        {
          label: options.readAhead ? t('readAhead') : '',
          value: options.readAhead && (
            <FFListText color="primary" text={options.readAhead.toString()} />
          ),
          button: options.readAhead ? (
            <FFCopyButton value={options.readAhead.toString()} />
          ) : (
            <></>
          ),
        },
        {
          label: options.withData ? t('withData') : '',
          value: options.withData && (
            <FFListText
              color="primary"
              text={options.withData ? t('yes') : t('no')}
            />
          ),
          button: options.withData ? (
            <FFCopyButton value={options.withData ? t('yes') : t('no')} />
          ) : (
            <></>
          ),
        },
      ]);
    }
  }, [options]);

  return (
    <>
      {dataList.map(
        (d, idx) => d.label !== '' && <FFListItem key={idx} item={d} />
      )}
    </>
  );
};
