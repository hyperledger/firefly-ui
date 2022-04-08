import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import { IIdentity } from '../../interfaces';
import { IDataListItem } from '../../interfaces/lists';
import { FFCopyButton } from '../Buttons/CopyButton';
import { MsgButton } from '../Buttons/MsgButton';
import { FFListItem } from './FFListItem';
import { FFListText } from './FFListText';
import { FFListTimestamp } from './FFListTimestamp';
import { FFSkeletonList } from './FFSkeletonList';

interface Props {
  identity?: IIdentity;
}

export const IdentityList: React.FC<Props> = ({ identity }) => {
  const { selectedNamespace } = useContext(ApplicationContext);
  const { t } = useTranslation();
  const [dataList, setDataList] = useState<IDataListItem[]>(FFSkeletonList);

  useEffect(() => {
    if (identity) {
      setDataList([
        {
          label: t('did'),
          value: <FFListText color="primary" text={identity.did} />,
          button: <FFCopyButton value={identity.did} />,
        },
        {
          label: t('id'),
          value: <FFListText color="primary" text={identity.id} />,
          button: <FFCopyButton value={identity.id} />,
        },
        {
          label: t('type'),
          value: <FFListText color="primary" text={identity.type} />,
          button: <FFCopyButton value={identity.type} />,
        },
        {
          label: t('parent'),
          value: identity.parent ? (
            <FFListText color="primary" text={identity.parent} />
          ) : (
            <FFListText color="secondary" text={t('noParentForIdentity')} />
          ),
          button: identity.parent ? (
            <FFCopyButton value={identity.type} />
          ) : (
            <></>
          ),
        },
        {
          label: t('messageClaim'),
          value: <FFListText color="primary" text={identity.messages.claim} />,
          button: (
            <>
              <MsgButton
                ns={selectedNamespace}
                msgID={identity.messages.claim}
              />
              <FFCopyButton value={identity.messages.claim} />
            </>
          ),
        },
        {
          label: t('messageVerification'),
          value: identity.messages.verification ? (
            <FFListText color="primary" text={identity.messages.verification} />
          ) : (
            <FFListText color="secondary" text={t('noMessageVerification')} />
          ),
          button: identity.messages.verification ? (
            <>
              <MsgButton
                ns={selectedNamespace}
                msgID={identity.messages.verification}
              />
              <FFCopyButton value={identity.messages.verification} />
            </>
          ) : (
            <></>
          ),
        },
        {
          label: t('updated'),
          value: <FFListTimestamp ts={identity.updated} />,
        },
        {
          label: t('created'),
          value: <FFListTimestamp ts={identity.created} />,
        },
      ]);
    }
  }, [identity]);

  return (
    <>
      {dataList.map((d, idx) => (
        <FFListItem key={idx} item={d} />
      ))}
    </>
  );
};
