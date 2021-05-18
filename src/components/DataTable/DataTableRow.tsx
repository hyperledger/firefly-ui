import React from 'react';
import { IDataTableRecord } from '../../interfaces';
import { TableRow, TableCell, withStyles, makeStyles } from '@material-ui/core';

interface Props {
  record: IDataTableRecord;
}

export const DataTableRow: React.FC<Props> = ({ record }) => {
  const classes = useStyles();

  return (
    <>
      <StyledTableRow>
        {record.columns.map((column, index) => (
          <TableCell
            className={classes.cell}
            key={index}
            onClick={record.onClick}
          >
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
    cursor: 'pointer',
  },
}))(TableRow);

const useStyles = makeStyles((theme) => ({
  cell: {
    borderBottom: 0,
    color: theme.palette.text.secondary,
  },
}));
