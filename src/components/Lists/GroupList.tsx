import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import { IGroup } from '../../interfaces';
import { IDataListItem } from '../../interfaces/lists';
import { FFCopyButton } from '../Buttons/CopyButton';
import { MsgButton } from '../Buttons/MsgButton';
import { FFListItem } from './FFListItem';
import { FFListText } from './FFListText';
import { FFListTimestamp } from './FFListTimestamp';
import { FFSkeletonList } from './FFSkeletonList';

interface Props {
  group?: IGroup;
}

export const GroupList: React.FC<Props> = ({ group }) => {
  const { selectedNamespace } = useContext(ApplicationContext);
  const { t } = useTranslation();
  const [dataList, setDataList] = useState<IDataListItem[]>(FFSkeletonList);

  useEffect(() => {
    if (group) {
      setDataList([
        {
          label: t('groupHash'),
          value: <FFListText color="primary" text={group.hash} />,
          button: <FFCopyButton value={group.hash} />,
        },
        {
          label: t('numberOfMembers'),
          value: (
            <FFListText
              color="primary"
              text={group.members.length.toString()}
            />
          ),
        },
        {
          label: t('messageID'),
          value: <FFListText color="primary" text={group.message} />,
          button: (
            <>
              <MsgButton ns={selectedNamespace} msgID={group.message} />
              <FFCopyButton value={group.message} />
            </>
          ),
        },
        {
          label: t('created'),
          value: <FFListTimestamp ts={group.created} />,
        },
      ]);
    }
  }, [group]);

  return (
    <>
      {dataList.map((d, idx) => (
        <FFListItem key={idx} item={d} />
      ))}
    </>
  );
};
