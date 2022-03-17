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

import { Grid, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Header } from '../../../components/Header';
import { ChartTableHeader } from '../../../components/Headers/ChartTableHeader';
import { HashPopover } from '../../../components/Popovers/HashPopover';
import { InterfaceSlide } from '../../../components/Slides/InterfaceSlide';
import { DataTable } from '../../../components/Tables/Table';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { SnackbarContext } from '../../../contexts/SnackbarContext';
import {
  FF_Paths,
  IContractInterface,
  ICreatedFilter,
  IDataTableRecord,
  IPagedContractInterfaceResponse,
} from '../../../interfaces';
import { DEFAULT_PADDING, DEFAULT_PAGE_LIMITS } from '../../../theme';
import { fetchCatcher, getCreatedFilter } from '../../../utils';

export const BlockchainInterfaces: () => JSX.Element = () => {
  const { createdFilter, selectedNamespace } = useContext(ApplicationContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const { t } = useTranslation();
  // Interfaces
  const [interfaces, setInterfaces] = useState<IContractInterface[]>();
  // Interface totals
  const [interfaceTotal, setInterfaceTotal] = useState(0);
  // View interface slide out
  const [viewInterface, setViewInterface] = useState<
    IContractInterface | undefined
  >();
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_PAGE_LIMITS[1]);

  // Interfaces
  useEffect(() => {
    const createdFilterObject: ICreatedFilter = getCreatedFilter(createdFilter);

    fetchCatcher(
      `${FF_Paths.nsPrefix}/${selectedNamespace}${
        FF_Paths.contractInterfaces
      }?limit=${rowsPerPage}&count&skip=${rowsPerPage * currentPage}${
        createdFilterObject.filterString
      }`
    )
      .then((interfaceRes: IPagedContractInterfaceResponse) => {
        setInterfaces(interfaceRes.items);
        setInterfaceTotal(interfaceRes.total);
      })
      .catch((err) => {
        reportFetchError(err);
      });
  }, [rowsPerPage, currentPage, selectedNamespace]);

  const interfaceColHeaders = [
    t('name'),
    t('id'),
    t('description'),
    t('messageID'),
    t('version'),
  ];

  const interfaceRecords: IDataTableRecord[] | undefined = interfaces?.map(
    (int) => ({
      key: int.id,
      columns: [
        {
          value: <Typography>{int.name}</Typography>,
        },
        {
          value: <HashPopover shortHash={true} address={int.id}></HashPopover>,
        },
        {
          value: <Typography>{int.description}</Typography>,
        },
        {
          value: (
            <HashPopover shortHash={true} address={int.message}></HashPopover>
          ),
        },
        {
          value: <Typography>{int.version}</Typography>,
        },
      ],
      onClick: () => setViewInterface(int),
    })
  );

  return (
    <>
      <Header
        title={t('contractInterfaces')}
        subtitle={t('blockchain')}
      ></Header>
      <Grid container px={DEFAULT_PADDING}>
        <Grid container item wrap="nowrap" direction="column">
          <ChartTableHeader title={t('allInterfaces')} />
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
            records={interfaceRecords}
            columnHeaders={interfaceColHeaders}
            paginate={true}
            emptyStateText={t('noInterfacesToDisplay')}
            dataTotal={interfaceTotal}
            currentPage={currentPage}
            rowsPerPage={rowsPerPage}
          />
        </Grid>
      </Grid>
      {viewInterface && (
        <InterfaceSlide
          cInterface={viewInterface}
          open={!!viewInterface}
          onClose={() => {
            setViewInterface(undefined);
          }}
        />
      )}
    </>
  );
};
