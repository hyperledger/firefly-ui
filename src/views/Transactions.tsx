import React, { useState, useEffect, useContext } from 'react';
import { Grid, Typography, TablePagination, makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { IDataTableRecord, ITransaction } from '../interfaces';
import { DataTable } from '../components/DataTable/DataTable';
import { AddressPopover } from '../components/AddressPopover';
import { NamespaceContext } from '../contexts/NamespaceContext';

const PAGE_LIMITS = [10, 25];

export const Transactions: React.FC = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const { selectedNamespace } = useContext(NamespaceContext);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(PAGE_LIMITS[0]);

  const columnHeaders = [
    t('hash'),
    t('blockNumber'),
    t('author'),
    t('status'),
    t('dateMined'),
  ];

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

  useEffect(() => {
    fetch(`/api/v1/namespaces/${selectedNamespace}/transactions?limit=${rowsPerPage}&skip=${rowsPerPage * currentPage}`).then(
      async (response) => {
        if (response.ok) {
          setTransactions(await response.json());
        } else {
          console.log('error fetching transactions');
        }
      }
    );
  }, [rowsPerPage, currentPage, selectedNamespace]);

  const records: IDataTableRecord[] = transactions.map((tx: ITransaction) => ({
    key: tx.id,
    columns: [
      {
        value: <AddressPopover textColor="secondary" address={tx.hash} />,
      },
      { value: tx.info?.blockNumber },
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
          <DataTable maxHeight="calc(100vh - 340px)" {...{ columnHeaders }} {...{ records }} {...{pagination}} />
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
  pagination: {
    color: theme.palette.text.secondary
  }
}));
