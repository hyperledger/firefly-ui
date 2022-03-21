import { Chip } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IMessage, MsgStateColorMap } from '../../interfaces';
import { FF_TX_CATEGORY_MAP } from '../../interfaces/enums/transactionTypes';
import { IDataListItem } from '../../interfaces/lists';
import { FFCopyButton } from '../Buttons/CopyButton';
import { FFCircleLoader } from '../Loaders/FFCircleLoader';
import { FFListItem } from './FFListItem';
import { FFListText } from './FFListText';
import { FFListTimestamp } from './FFListTimestamp';
import { FFSkeletonList } from './FFSkeletonList';

interface Props {
  message?: IMessage;
}

export const MessageList: React.FC<Props> = ({ message }) => {
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
          label: t('authorKey'),
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
        },
        {
          label: t('status'),
          value: message && (
            <Chip
              label={message.state?.toLocaleUpperCase()}
              sx={{ backgroundColor: MsgStateColorMap[message.state] }}
            ></Chip>
          ),
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
      {!message ? (
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
