// Copyright © 2022 Kaleido, Inc.
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

import { Button, Grid, Typography } from '@mui/material';
import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getCreatedFilter } from '../../../components/Filters/utils';
import { Header } from '../../../components/Header';
import { ChartTableHeader } from '../../../components/Headers/ChartTableHeader';
import { HashPopover } from '../../../components/Popovers/HashPopover';
import { DataTable } from '../../../components/Tables/Table';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { SnackbarContext } from '../../../contexts/SnackbarContext';
import {
  FF_Paths,
  ICreatedFilter,
  IDataTableRecord,
  IDatatype,
  IPagedDatatypeResponse,
} from '../../../interfaces';
import { DEFAULT_PADDING, DEFAULT_PAGE_LIMITS } from '../../../theme';
import { fetchCatcher } from '../../../utils';

export const OffChainDataTypes: () => JSX.Element = () => {
  const { createdFilter, selectedNamespace } = useContext(ApplicationContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const { t } = useTranslation();
  // Datatype
  const [datatypes, setDatatypes] = useState<IDatatype[]>();
  // Data total
  const [datatypeTotal, setDatatypeTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_PAGE_LIMITS[1]);

  // Data type
  useEffect(() => {
    const createdFilterObject: ICreatedFilter = getCreatedFilter(createdFilter);

    fetchCatcher(
      `${FF_Paths.nsPrefix}/${selectedNamespace}${
        FF_Paths.datatypes
      }?limit=${rowsPerPage}&count&skip=${rowsPerPage * currentPage}${
        createdFilterObject.filterString
      }`
    )
      .then((datatypeRes: IPagedDatatypeResponse) => {
        setDatatypes(datatypeRes.items);
        setDatatypeTotal(datatypeRes.total);
      })
      .catch((err) => {
        reportFetchError(err);
      });
  }, [rowsPerPage, currentPage, selectedNamespace]);

  const datatypeColHeaders = [
    t('id'),
    t('name'),
    t('dataHash'),
    t('messageID'),
    t('validator'),
    t('version'),
    t('created'),
  ];

  const datatypeRecords: IDataTableRecord[] | undefined = datatypes?.map(
    (d) => ({
      key: d.id,
      columns: [
        {
          value: <HashPopover shortHash address={d.id}></HashPopover>,
        },
        {
          value: <Typography>{d.name}</Typography>,
        },
        {
          value: <HashPopover shortHash address={d.hash}></HashPopover>,
        },
        {
          value: <HashPopover shortHash address={d.message}></HashPopover>,
        },
        {
          value: <Typography>{d.validator}</Typography>,
        },
        {
          value: <Typography>{d.version}</Typography>,
        },
        {
          value: dayjs(d.created).format('MM/DD/YYYY h:mm A'),
        },
      ],
    })
  );

  return (
    <>
      <Header title={t('datatypes')} subtitle={t('offChain')}></Header>
      <Grid container px={DEFAULT_PADDING}>
        <Grid container item wrap="nowrap" direction="column">
          <ChartTableHeader
            title={t('allDatatypes')}
            filter={
              <Button variant="outlined">
                <Typography p={0.75} sx={{ fontSize: 12 }}>
                  {t('filter')}
                </Typography>
              </Button>
            }
          />
          <DataTable
            onHandleCurrPageChange={(currentPage: number) =>
              setCurrentPage(currentPage)
            }
            onHandleRowsPerPage={(rowsPerPage: number) =>
              setRowsPerPage(rowsPerPage)
            }
            stickyHeader={true}
            minHeight="300px"
            maxHeight="calc(100vh - 340px)"
            records={datatypeRecords}
            columnHeaders={datatypeColHeaders}
            paginate={true}
            emptyStateText={t('noDatatypesToDisplay')}
            dataTotal={datatypeTotal}
            currentPage={currentPage}
            rowsPerPage={rowsPerPage}
          />
        </Grid>
      </Grid>
    </>
  );
};
