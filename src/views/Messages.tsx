import React, { useState, useCallback, useEffect } from 'react';
import { Grid, Typography, makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { IDataTableRecord, IMessage } from '../interfaces';
import { DataTable } from '../components/DataTable/DataTable';
import { AddressPopover } from '../components/AddressPopover';
import { MessageDetails } from '../components/MessageDetails';
import DoneIcon from '@material-ui/icons/Done';

export const Messages: React.FC = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [viewMessage, setViewMessage] = useState<IMessage | undefined>();

  const columnHeaders = [
    t('author'),
    t('type'),
    t('topic'),
    t('context'),
    t('pinned'),
    t('dataHash'),
    t('createdOn'),
  ];

  const queryMessages = useCallback(() => {
    fetch('/api/v1/ns/ns1/messages').then(async (response) => {
      if (response.ok) {
        setMessages(await response.json());
      } else {
        console.log('error fetching messages');
      }
    });
  }, []);

  useEffect(() => {
    queryMessages();
  }, [queryMessages]);

  const records: IDataTableRecord[] = messages.map((message: IMessage) => ({
    key: message.header.id,
    columns: [
      {
        value: (
          <AddressPopover
            textColor="secondary"
            address={message.header.author}
          />
        ),
      },
      { value: message.header.type },
      { value: message.header.topic },
      { value: message.header.context },
      { value: message.header.tx.type === 'pin' ? <DoneIcon /> : undefined },
      {
        value: (
          <AddressPopover
            textColor="secondary"
            address={message.header.datahash}
          />
        ),
      },
      { value: dayjs(message.header.created).format('MM/DD/YYYY h:mm A') },
    ],
    onClick: () => setViewMessage(message),
  }));

  return (
    <>
      <Grid container wrap="nowrap" direction="column" className={classes.root}>
        <Grid item>
          <Typography className={classes.header} variant="h4">
            {t('messages')}
          </Typography>
        </Grid>
        <Grid container item>
          <DataTable {...{ columnHeaders }} {...{ records }} />
        </Grid>
      </Grid>
      {viewMessage && (
        <MessageDetails
          open={!!viewMessage}
          onClose={() => setViewMessage(undefined)}
          message={viewMessage}
        />
      )}
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: 80,
    paddingLeft: 120,
    paddingRight: 120,
    [theme.breakpoints.down('sm')]: {
      flexWrap: 'wrap',
    },
  },
  header: {
    fontWeight: 'bold',
  },
}));
