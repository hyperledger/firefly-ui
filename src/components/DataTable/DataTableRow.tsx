import React from 'react';
import { IDataTableRecord } from '../../interfaces';
import { TableRow, TableCell, withStyles, makeStyles } from '@material-ui/core';
import clsx from 'clsx';

interface Props {
  record: IDataTableRecord;
}

export const DataTableRow: React.FC<Props> = ({ record }) => {
  const classes = useStyles();

  return (
    <>
      <StyledTableRow
        className={clsx(record.onClick && classes.clickable)}
        onClick={record.onClick}
      >
        {record.columns.map((column, index) => (
          <TableCell className={classes.cell} key={index}>
            {column.value}
          </TableCell>
        ))}
      </StyledTableRow>
    </>
  );
};

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(even)': {
      backgroundColor: theme.palette.tableRowAlternate.main,
    },
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.paper,
    },
  },
}))(TableRow);

const useStyles = makeStyles((theme) => ({
  cell: {
    borderBottom: 0,
    color: theme.palette.text.secondary,
  },
  clickable: {
    cursor: 'pointer',
  },
}));
