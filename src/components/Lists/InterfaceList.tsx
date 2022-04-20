import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import { IContractInterface } from '../../interfaces';
import { IDataListItem } from '../../interfaces/lists';
import { FFCopyButton } from '../Buttons/CopyButton';
import { MsgButton } from '../Buttons/MsgButton';
import { FFListItem } from './FFListItem';
import { FFListText } from './FFListText';
import { FFSkeletonList } from './FFSkeletonList';

interface Props {
  cInterface?: IContractInterface;
}

export const InterfaceList: React.FC<Props> = ({ cInterface }) => {
  const { t } = useTranslation();
  const { selectedNamespace } = useContext(ApplicationContext);
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
          button: (
            <>
              <MsgButton ns={selectedNamespace} msgID={cInterface?.message} />
              <FFCopyButton value={cInterface?.message ?? ''} />
            </>
          ),
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
      {dataList.map((d, idx) => (
        <FFListItem key={idx} item={d} />
      ))}
    </>
  );
};
