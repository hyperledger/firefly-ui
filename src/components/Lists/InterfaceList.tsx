import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IContractInterface } from '../../interfaces';
import { IDataListItem } from '../../interfaces/lists';
import { FFCopyButton } from '../Buttons/CopyButton';
import { FFCircleLoader } from '../Loaders/FFCircleLoader';
import { FFListItem } from './FFListItem';
import { FFListText } from './FFListText';
import { FFSkeletonList } from './FFSkeletonList';

interface Props {
  cInterface?: IContractInterface;
}

export const InterfaceList: React.FC<Props> = ({ cInterface }) => {
  const { t } = useTranslation();
  const [dataList, setDataList] = useState<IDataListItem[]>(FFSkeletonList);

  useEffect(() => {
    if (cInterface) {
      setDataList([
        {
          label: t('id'),
          value: <FFListText text={cInterface?.id ?? ''} color="primary" />,
          button: <FFCopyButton value={cInterface?.id ?? ''} />,
        },
        {
          label: t('messageID'),
          value: (
            <FFListText text={cInterface?.message ?? ''} color="primary" />
          ),
          button: <FFCopyButton value={cInterface?.id ?? ''} />,
        },
        {
          label: t('version'),
          value: (
            <FFListText text={cInterface?.version ?? ''} color="primary" />
          ),
        },
        {
          label: t('description'),
          value: cInterface?.description.length ? (
            <FFListText text={cInterface.description} color="primary" />
          ) : (
            <FFListText
              text={t('noDescriptionForInterface')}
              color="secondary"
            />
          ),
        },
      ]);
    }
  }, [cInterface]);

  return (
    <>
      {!cInterface ? (
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
