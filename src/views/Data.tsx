import React, { useState, useEffect, useContext } from 'react';
import {
  Grid,
  Typography,
  TablePagination,
  makeStyles,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { IDataTableRecord, IData } from '../interfaces';
import { DataTable } from '../components/DataTable/DataTable';
import { HashPopover } from '../components/HashPopover';
import { NamespaceContext } from '../contexts/NamespaceContext';

const PAGE_LIMITS = [10, 25];

export const Data: React.FC = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [transactions, setTransactions] = useState<IData[]>([]);
  const { selectedNamespace } = useContext(NamespaceContext);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(PAGE_LIMITS[0]);

  const columnHeaders = [
    t('id'),
    t('validator'),
    t('dataHash'),
    t('createdOn'),
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
    fetch(
      `/api/v1/namespaces/${selectedNamespace}/data?limit=${rowsPerPage}&skip=${
        rowsPerPage * currentPage
      }`
    ).then(async (response) => {
      if (response.ok) {
        setTransactions(await response.json());
      } else {
        console.log('error fetching data');
      }
    });
  }, [rowsPerPage, currentPage, selectedNamespace]);

  const records: IDataTableRecord[] = transactions.map((data: IData) => ({
    key: data.id,
    columns: [
      {
        value: <HashPopover textColor="secondary" address={data.id} />,
      },
      { value: data.validator },
      {
        value: <HashPopover textColor="secondary" address={data.hash} />,
      },
      { value: dayjs(data.created).format('MM/DD/YYYY h:mm A') },
    ],
  }));

  return (
    <>
      <Grid container wrap="nowrap" direction="column" className={classes.root}>
        <Grid item>
          <Typography className={classes.header} variant="h4">
            {t('data')}
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
