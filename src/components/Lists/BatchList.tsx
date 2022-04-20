import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IBatch } from '../../interfaces';
import { IDataListItem } from '../../interfaces/lists';
import { FFCopyButton } from '../Buttons/CopyButton';
import { IdentityButton } from '../Buttons/IdentityButton';
import { FFListItem } from './FFListItem';
import { FFListText } from './FFListText';
import { FFListTimestamp } from './FFListTimestamp';
import { FFSkeletonList } from './FFSkeletonList';

interface Props {
  batch?: IBatch;
}

export const BatchList: React.FC<Props> = ({ batch }) => {
  const { t } = useTranslation();
  const [dataList, setDataList] = useState<IDataListItem[]>(FFSkeletonList);

  useEffect(() => {
    batch &&
      setDataList([
        {
          label: t('id'),
          value: <FFListText color="primary" text={batch.id} />,
          button: <FFCopyButton value={batch.id} />,
        },
        {
          label: t('type'),
          value: <FFListText color="primary" text={batch.type} />,
        },
        {
          label: t('hash'),
          value: <FFListText color="primary" text={batch.hash} />,
          button: <FFCopyButton value={batch.hash} />,
        },
        {
          label: t('author'),
          value: <FFListText color="primary" text={batch.author} />,
          button: (
            <>
              <IdentityButton did={batch.author} />
              <FFCopyButton value={batch.author} />
            </>
          ),
        },
        {
          label: batch.node ? t('node') : '',
          value: batch.node && <FFListText color="primary" text={batch.node} />,
          button: batch.node ? (
            <>
              <IdentityButton nodeID={batch.node} />
              <FFCopyButton value={batch.node} />
            </>
          ) : (
            <></>
          ),
        },
        {
          label: batch.group ? t('group') : '',
          value: batch.group ? (
            <FFListText color="primary" text={batch.group} />
          ) : (
            <></>
          ),
          button: batch.group ? <FFCopyButton value={batch.group} /> : <></>,
        },
        {
          label: t('signingKey'),
          value: <FFListText color="primary" text={batch.key} />,
          button: <FFCopyButton value={batch.key} />,
        },
        {
          label: t('created'),
          value: <FFListTimestamp ts={batch.created} />,
        },
        {
          label: batch.confirmed ? t('confirmed') : '',
          value: batch.confirmed ? (
            <FFListTimestamp ts={batch.confirmed} />
          ) : (
            <></>
          ),
        },
      ]);
  }, [batch]);

  return (
    <>
      {dataList.map(
        (d, idx) => d.label !== '' && <FFListItem key={idx} item={d} />
      )}
    </>
  );
};
