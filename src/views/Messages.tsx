import React, { useState, useEffect, useContext } from 'react';
import {
  Grid,
  Typography,
  TablePagination,
  makeStyles,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { IDataTableRecord, IMessage } from '../interfaces';
import { DataTable } from '../components/DataTable/DataTable';
import { HashPopover } from '../components/HashPopover';
import { MessageDetails } from '../components/MessageDetails';
import CheckIcon from 'mdi-react/CheckIcon';
import { NamespaceContext } from '../contexts/NamespaceContext';

const PAGE_LIMITS = [10, 25];

export const Messages: React.FC = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [viewMessage, setViewMessage] = useState<IMessage | undefined>();
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(PAGE_LIMITS[0]);
  const { selectedNamespace } = useContext(NamespaceContext);

  useEffect(() => {
    fetch(
      `/api/v1/namespaces/${selectedNamespace}/messages?limit=${rowsPerPage}&skip=${
        rowsPerPage * currentPage
      }`
    ).then(async (response) => {
      if (response.ok) {
        setMessages(await response.json());
      } else {
        console.log('error fetching messages');
      }
    });
  }, [rowsPerPage, currentPage, selectedNamespace]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCurrentPage(0);
    setRowsPerPage(+event.target.value);
  };

  const pagination = (
    <TablePagination
      component="div"
      count={-1}
      rowsPerPage={rowsPerPage}
      page={currentPage}
      onChangePage={handleChangePage}
      onChangeRowsPerPage={handleChangeRowsPerPage}
      rowsPerPageOptions={PAGE_LIMITS}
      labelDisplayedRows={({ from, to }) => `${from} - ${to}`}
      className={classes.pagination}
    />
  );

  const columnHeaders = [
    t('author'),
    t('type'),
    t('topic'),
    t('context'),
    t('pinned'),
    t('dataHash'),
    t('createdOn'),
  ];

  const records: IDataTableRecord[] = messages.map((message: IMessage) => ({
    key: message.header.id,
    columns: [
      {
        value: (
          <HashPopover textColor="secondary" address={message.header.author} />
        ),
      },
      { value: message.header.type },
      { value: message.header.topic },
      { value: message.header.context },
      { value: message.header.tx.type === 'pin' ? <CheckIcon /> : undefined },
      {
        value: (
          <HashPopover
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
          <DataTable
            maxHeight="calc(100vh - 340px)"
            {...{ columnHeaders }}
            {...{ records }}
            {...{ pagination }}
          />
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
  pagination: {
    color: theme.palette.text.secondary,
  },
}));
