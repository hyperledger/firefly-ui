import { Chip } from '@mui/material';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IMessage, MsgStateColorMap } from '../../interfaces';
import { FF_TX_CATEGORY_MAP } from '../../interfaces/enums/transactionTypes';
import { IDataListItem } from '../../interfaces/lists';
import { FFCopyButton } from '../Buttons/CopyButton';
import { FFCircleLoader } from '../Loaders/FFCircleLoader';
import { FFListItem } from './FFListItem';

interface Props {
  message?: IMessage;
}

export const MessageList: React.FC<Props> = ({ message }) => {
  const { t } = useTranslation();
  const [dataList, setDataList] = useState<IDataListItem[]>([]);

  useEffect(() => {
    if (message) {
      setDataList([
        {
          label: t('id'),
          value: message.header.id,
          button: <FFCopyButton value={message.header.id} />,
        },
        {
          label: t('transactionType'),
          value: t(
            FF_TX_CATEGORY_MAP[message.header.txtype].nicename
          ).toString(),
          button: <FFCopyButton value={message.header.txtype} />,
        },
        {
          label: t('author'),
          value: message.header.author,
          button: <FFCopyButton value={message.header.author} />,
        },
        {
          label: t('authorKey'),
          value: message.header.key,
          button: <FFCopyButton value={message.header.key} />,
        },
        {
          label: t('tag'),
          value: message.header.tag ?? t('noTagInMessage'),
          button: message.header.tag ? (
            <FFCopyButton value={message.header.tag} />
          ) : undefined,
        },
        {
          label: t('topics'),
          value: message.header.topics?.toString() ?? t('noTopicInMessage'),
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
          value: dayjs(message.confirmed).format('MM/DD/YYYY h:mm A'),
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
          {dataList.map((d) => (
            <FFListItem key={d.label} item={d} />
          ))}
        </>
      )}
    </>
  );
};
