import React, { useEffect, useState, useContext } from 'react';
import {
  Grid,
  makeStyles,
  Typography,
  Card,
  CardContent,
  Box,
  CircularProgress,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { IDataTableRecord, IMessage, ITransaction } from '../interfaces';
import { DataTable } from '../components/DataTable/DataTable';
import dayjs from 'dayjs';
import { HashPopover } from '../components/HashPopover';
import { NamespaceContext } from '../contexts/NamespaceContext';

export const Dashboard: React.FC = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const { selectedNamespace } = useContext(NamespaceContext);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`/api/v1/namespaces/${selectedNamespace}/messages?limit=5`),
      fetch(`/api/v1/namespaces/${selectedNamespace}/transactions?limit=1`),
    ])
      .then(async ([messageResponse, transactionResponse]) => {
        if (messageResponse.ok && transactionResponse.ok) {
          setMessages(await messageResponse.json());
          setTransactions(await transactionResponse.json());
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedNamespace]);

  const summaryPanel = (label: string, value: string | number) => (
    <Card>
      <CardContent className={classes.content}>
        <Typography noWrap className={classes.summaryLabel}>
          {label}
        </Typography>
        <Typography noWrap className={classes.summaryValue}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  const messageColumnHeaders = [
    t('author'),
    t('type'),
    t('dataHash'),
    t('createdOn'),
  ];

  const messageRecords: IDataTableRecord[] = messages.map(
    (message: IMessage) => ({
      key: message.header.id,
      columns: [
        {
          value: (
            <HashPopover
              textColor="secondary"
              address={message.header.author}
            />
          ),
        },
        {
          value: message.header.type,
        },
        {
          value: (
            <HashPopover
              textColor="secondary"
              address={message.header.datahash}
            />
          ),
        },
        {
          value: dayjs(message.header.created).format('MM/DD/YYYY h:mm A'),
        },
      ],
    })
  );

  if (loading) {
    return (
      <Box className={classes.centeredContent}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Grid container wrap="nowrap" className={classes.root} direction="column">
        <Grid className={classes.headerContainer} item>
          <Typography variant="h4" className={classes.header}>
            {t('explorer')}
          </Typography>
        </Grid>
        <Grid
          className={classes.cardContainer}
          spacing={6}
          container
          item
          direction="row"
        >
          <Grid xs={6} sm={3} item>
            {summaryPanel(
              t('networkMembers'),
              Math.floor(Math.random() * 1000)
            )}
          </Grid>
          <Grid xs={6} sm={3} item>
            {summaryPanel(
              t('messages'),
              messages.length !== 0 ? messages[0].sequence : 0
            )}
          </Grid>
          <Grid xs={6} sm={3} item>
            {summaryPanel(
              t('transactions'),
              transactions.length !== 0 ? transactions[0].sequence : 0
            )}
          </Grid>
        </Grid>
        <Grid item>
          <DataTable
            columnHeaders={messageColumnHeaders}
            records={messageRecords}
            header={t('latestMessages')}
          />
        </Grid>
      </Grid>
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
  headerContainer: {
    marginBottom: theme.spacing(5),
  },
  summaryLabel: {
    color: theme.palette.text.secondary,
    textTransform: 'uppercase',
    fontSize: 12,
  },
  summaryValue: {
    fontSize: 32,
  },
  content: {
    padding: theme.spacing(3),
  },
  cardContainer: {
    paddingBottom: theme.spacing(4),
  },
  centeredContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: 'calc(100vh - 300px)',
    overflow: 'auto',
  },
}));
