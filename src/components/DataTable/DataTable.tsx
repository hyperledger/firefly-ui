import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { IDataTableRecord } from '../../interfaces';
import { DataTableRow } from './DataTableRow';

interface Props {
  records?: IDataTableRecord[];
  columnHeaders?: string[];
  stickyHeader?: boolean;
}

export const DataTable: React.FC<Props> = ({
  records,
  columnHeaders,
  stickyHeader,
}) => {
  const classes = useStyles();

  return (
    <>
      <TableContainer className={classes.tableContainer}>
        <Table stickyHeader={stickyHeader}>
          <TableHead>
            <TableRow>
              {columnHeaders?.map((header, index) => (
                <TableCell className={classes.cell} key={index}>
                  <Typography noWrap>{header}</Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {records?.map((record) => (
              <DataTableRow key={record.key} {...{ record }} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    whiteSpace: 'nowrap',
    minHeight: 300,
    height: 'calc(100vh - 349px)',
  },
  cell: {
    borderBottom: 0,
    color: theme.palette.text.secondary,
  },
}));
