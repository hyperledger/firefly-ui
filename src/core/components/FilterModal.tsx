// Copyright © 2021 Kaleido, Inc.
//
// SPDX-License-Identifier: Apache-2.0
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Popover,
  Button,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  SelectChangeEvent,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import CloseIcon from 'mdi-react/CloseIcon';
import { useTranslation } from 'react-i18next';

interface Props {
  anchor: HTMLButtonElement | null;
  onClose: () => void;
  fields: string[];
  operators: string[];
  addFilter: (filter: string) => void;
}

export const FilterModal: React.FC<Props> = ({
  anchor,
  onClose,
  fields,
  operators,
  addFilter,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [filterValue, setFilterValue] = useState('');
  const [filterField, setFilterField] = useState('');
  const [filterOperator, setFilterOperator] = useState('');

  useEffect(() => {
    if (anchor) {
      setOpen(Boolean(anchor));
    }
  }, [anchor]);

  const handleSubmit = () => {
    const filter = `${filterField}${filterOperator}${filterValue}`;
    addFilter(filter);
    onClose();
  };

  const handleFieldChange = (event: SelectChangeEvent) => {
    setFilterField(event.target.value as string);
  };

  const handleOperatorChange = (event: SelectChangeEvent) => {
    setFilterOperator(event.target.value as string);
  };

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterValue(event.target.value as string);
  };

  return (
    <>
      <Popover
        open={open}
        onClose={onClose}
        anchorEl={anchor}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: -8,
          horizontal: 'right',
        }}
        className={classes.root}
      >
        <Paper className={classes.paper}>
          <Grid
            className={classes.header}
            container
            justifyContent="space-between"
          >
            <Grid item>
              <Typography className={classes.bold}>{t('addFilter')}</Typography>
            </Grid>
            <Grid item>
              <CloseIcon className={classes.closeButton} onClick={onClose} />
            </Grid>
          </Grid>
          <form>
            <Grid container>
              <Grid item xs={6} className={classes.form}>
                <InputLabel id="field-filter-label">{t('field')}</InputLabel>
                <Select
                  variant="outlined"
                  fullWidth
                  size="small"
                  labelId="field-filter-label"
                  value={filterField}
                  onChange={handleFieldChange}
                >
                  {fields.map((field) => (
                    <MenuItem key={field} value={field}>
                      {field}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={6} className={classes.form}>
                <InputLabel id="operator-filter-label">
                  {t('operator')}
                </InputLabel>
                <Select
                  fullWidth
                  size="small"
                  labelId="operator-filter-label"
                  value={filterOperator}
                  onChange={handleOperatorChange}
                >
                  {operators.map((operator) => (
                    <MenuItem key={operator} value={operator}>
                      {operator}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={12} className={classes.form}>
                <InputLabel id="value-filter-label">{t('value')}</InputLabel>
                <TextField
                  fullWidth
                  value={filterValue}
                  onChange={handleValueChange}
                  size="small"
                />
              </Grid>
            </Grid>
            <Grid
              className={classes.buttonContainer}
              container
              justifyContent="flex-end"
              spacing={1}
            >
              <Grid item>
                <Button>{t('cancel')}</Button>
              </Grid>
              <Grid item>
                <Button variant="contained" onClick={handleSubmit}>
                  {t('save')}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Popover>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    outline: 'none',
    minWidth: 450,
    padding: theme.spacing(2),
  },
  close: {
    position: 'absolute',
    color: theme.palette.text.secondary,
  },
  closeButton: {
    cursor: 'pointer',
    marginRight: theme.spacing(1),
  },
  form: {
    padding: theme.spacing(1),
  },
  buttonContainer: {
    padding: theme.spacing(1),
  },
  header: {
    margin: theme.spacing(1),
  },
  bold: {
    fontWeight: 'bold',
  },
}));
