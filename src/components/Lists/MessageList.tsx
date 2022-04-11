import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import { FF_NAV_PATHS, IMessage } from '../../interfaces';
import { FF_TX_CATEGORY_MAP } from '../../interfaces/enums/transactionTypes';
import { IDataListItem } from '../../interfaces/lists';
import { FFCopyButton } from '../Buttons/CopyButton';
import { LaunchButton } from '../Buttons/LaunchButton';
import { MsgStatusChip } from '../Chips/MsgStatusChip';
import { FFListItem } from './FFListItem';
import { FFListText } from './FFListText';
import { FFListTimestamp } from './FFListTimestamp';
import { FFSkeletonList } from './FFSkeletonList';

interface Props {
  message?: IMessage;
}

export const MessageList: React.FC<Props> = ({ message }) => {
  const { selectedNamespace } = useContext(ApplicationContext);
  const { t } = useTranslation();
  const [dataList, setDataList] = useState<IDataListItem[]>(FFSkeletonList);

  useEffect(() => {
    if (message) {
      setDataList([
        {
          label: t('id'),
          value: <FFListText color="primary" text={message.header.id} />,
          button: <FFCopyButton value={message.header.id} />,
        },
        {
          label: t('transactionType'),
          value: (
            <FFListText
              color="primary"
              text={t(FF_TX_CATEGORY_MAP[message.header.txtype]?.nicename)}
            />
          ),
          button: <FFCopyButton value={message.header.txtype} />,
        },
        {
          label: t('author'),
          value: <FFListText color="primary" text={message.header.author} />,
          button: <FFCopyButton value={message.header.author} />,
        },
        {
          label: t('signingKey'),
          value: <FFListText color="primary" text={message.header.key} />,
          button: <FFCopyButton value={message.header.key} />,
        },
        {
          label: t('tag'),
          value: message.header.tag ? (
            <FFListText color="primary" text={message.header.tag} />
          ) : (
            <FFListText color="secondary" text={t('noTagInMessage')} />
          ),
          button: message.header.tag ? (
            <FFCopyButton value={message.header.tag} />
          ) : undefined,
        },
        {
          label: t('topics'),
          value: message.header.topics ? (
            <FFListText
              color="primary"
              text={message.header.topics.toString()}
            />
          ) : (
            <FFListText color="secondary" text={t('noTopicInMessage')} />
          ),
          button: message.header.topics ? (
            <FFCopyButton value={message.header.topics.toString()} />
          ) : undefined,
        },
        {
          label: t('batchID'),
          value: <FFListText color="primary" text={message.batch} />,
          button: (
            <>
              <LaunchButton
                link={FF_NAV_PATHS.offchainBatchesPath(
                  selectedNamespace,
                  message.batch
                )}
              />
              <FFCopyButton value={message.batch} />
            </>
          ),
        },
        {
          label: t('status'),
          value: message && <MsgStatusChip msg={message} />,
        },
        {
          label: t('confirmed'),
          value: <FFListTimestamp ts={message.confirmed} />,
        },
      ]);
    }
  }, [message]);

  return (
    <>
      {dataList.map((d, idx) => (
        <FFListItem key={idx} item={d} />
      ))}
    </>
  );
};
