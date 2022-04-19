import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import { IDatatype } from '../../interfaces';
import { IDataListItem } from '../../interfaces/lists';
import { FFCopyButton } from '../Buttons/CopyButton';
import { MsgButton } from '../Buttons/MsgButton';
import { FFListItem } from './FFListItem';
import { FFListText } from './FFListText';
import { FFListTimestamp } from './FFListTimestamp';
import { FFSkeletonList } from './FFSkeletonList';

interface Props {
  dt?: IDatatype;
}

export const DatatypeList: React.FC<Props> = ({ dt }) => {
  const { t } = useTranslation();
  const { selectedNamespace } = useContext(ApplicationContext);
  const [dataList, setDataList] = useState<IDataListItem[]>(FFSkeletonList);

  useEffect(() => {
    if (dt) {
      setDataList([
        {
          label: t('id'),
          value: <FFListText color="primary" text={dt.id} />,
          button: <FFCopyButton value={dt.id} />,
        },
        {
          label: t('hash'),
          value: <FFListText color="primary" text={dt.hash} />,
          button: <FFCopyButton value={dt.hash} />,
        },
        {
          label: t('message'),
          value: <FFListText color="primary" text={dt.message} />,
          button: (
            <>
              <MsgButton ns={selectedNamespace} msgID={dt.message} />
              <FFCopyButton value={dt.message} />
            </>
          ),
        },
        {
          label: t('version'),
          value: <FFListText color="primary" text={dt.version} />,
        },
        {
          label: t('validator'),
          value: <FFListText color="primary" text={dt.validator} />,
        },
        {
          label: t('created'),
          value: <FFListTimestamp ts={dt.created} />,
        },
      ]);
    }
  }, [dt]);

  return (
    <>
      {dataList.map((d, idx) => (
        <FFListItem key={idx} item={d} />
      ))}
    </>
  );
};
