import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ITokenApproval } from '../../interfaces';
import { IDataListItem } from '../../interfaces/lists';
import { FFCopyButton } from '../Buttons/CopyButton';
import { PoolButton } from '../Buttons/PoolButton';
import { FFListItem } from './FFListItem';
import { FFListText } from './FFListText';
import { FFListTimestamp } from './FFListTimestamp';
import { FFSkeletonList } from './FFSkeletonList';

interface Props {
  approval?: ITokenApproval;
}

export const ApprovalList: React.FC<Props> = ({ approval }) => {
  const { t } = useTranslation();
  const [dataList, setDataList] = useState<IDataListItem[]>(FFSkeletonList);

  useEffect(() => {
    approval &&
      setDataList([
        {
          label: t('id'),
          value: <FFListText color="primary" text={approval.localId} />,
          button: <FFCopyButton value={approval.localId} />,
        },
        {
          label: t('signingKey'),
          value: <FFListText color="primary" text={approval.key} />,
          button: <FFCopyButton value={approval.key} />,
        },
        {
          label: t('operator'),
          value: <FFListText color="primary" text={approval.operator} />,
          button: <FFCopyButton value={approval.operator} />,
        },
        {
          label: t('pool'),
          value: <FFListText color="primary" text={approval.pool} />,
          button: (
            <>
              <PoolButton poolID={approval.pool} />
              <FFCopyButton value={approval.pool} />
            </>
          ),
        },
        {
          label: t('protocolID'),
          value: <FFListText color="primary" text={approval.protocolId} />,
          button: <FFCopyButton value={approval.protocolId} />,
        },
        {
          label: t('approved?'),
          value: (
            <FFListText
              color="primary"
              text={
                approval.approved
                  ? t('yes').toUpperCase()
                  : t('no').toUpperCase()
              }
            />
          ),
        },
        {
          label: t('created'),
          value: <FFListTimestamp ts={approval.created} />,
        },
      ]);
  }, [approval]);

  return (
    <>
      {dataList.map((d, idx) => (
        <FFListItem key={idx} item={d} />
      ))}
    </>
  );
};
