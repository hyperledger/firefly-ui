import React, { useState, useEffect, useContext } from 'react';
import { Grid, Typography, makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { IDataTableRecord, ITransaction } from '../interfaces';
import { DataTable } from '../components/DataTable/DataTable';
import { AddressPopover } from '../components/AddressPopover';
import { NamespaceContext } from '../contexts/NamespaceContext';

export const Transactions: React.FC = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const { selectedNamespace } = useContext(NamespaceContext);

  const columnHeaders = [
    t('hash'),
    t('blockNumber'),
    t('author'),
    t('status'),
    t('dateMined'),
  ];

  useEffect(() => {
    fetch(`/api/v1/namespaces/${selectedNamespace}/transactions`).then(
      async (response) => {
        if (response.ok) {
          setTransactions(await response.json());
        } else {
          console.log('error fetching transactions');
        }
      }
    );
  }, [selectedNamespace]);

  const records: IDataTableRecord[] = transactions.map((tx: ITransaction) => ({
    key: tx.id,
    columns: [
      {
        value: <AddressPopover textColor="secondary" address={tx.hash} />,
      },
      { value: tx.info.blockNumber },
      {
        value: (
          <AddressPopover textColor="secondary" address={tx.subject.author} />
        ),
      },
      { value: tx.status },
      { value: dayjs(tx.confirmed).format('MM/DD/YYYY h:mm A') },
    ],
  }));

  return (
    <>
      <Grid container wrap="nowrap" direction="column" className={classes.root}>
        <Grid item>
          <Typography className={classes.header} variant="h4">
            {t('transactions')}
          </Typography>
        </Grid>
        <Grid container item>
          <DataTable {...{ columnHeaders }} {...{ records }} />
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
}));
