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

import HiveIcon from '@mui/icons-material/Hive';
import { Chip, Grid } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FilterButton } from '../../../components/Filters/FilterButton';
import { FilterModal } from '../../../components/Filters/FilterModal';
import { Header } from '../../../components/Header';
import { ChartTableHeader } from '../../../components/Headers/ChartTableHeader';
import { HashPopover } from '../../../components/Popovers/HashPopover';
import { FFTableText } from '../../../components/Tables/FFTableText';
import { DataTable } from '../../../components/Tables/Table';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { FilterContext } from '../../../contexts/FilterContext';
import { SnackbarContext } from '../../../contexts/SnackbarContext';
import {
  FF_Paths,
  IDataTableRecord,
  IdentityFilters,
  IOrganization,
  IPagedOrganizationResponse,
} from '../../../interfaces';
import { DEFAULT_PADDING, DEFAULT_PAGE_LIMITS } from '../../../theme';
import { fetchCatcher, getFFTime } from '../../../utils';

export const NetworkOrganizations: () => JSX.Element = () => {
  const { orgName } = useContext(ApplicationContext);
  const {
    filterAnchor,
    setFilterAnchor,
    activeFilters,
    setActiveFilters,
    filterString,
  } = useContext(FilterContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const { t } = useTranslation();

  // Organizations
  const [orgs, setOrgs] = useState<IOrganization[]>();
  // Org total
  const [orgTotal, setOrgTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_PAGE_LIMITS[1]);

  // Organizations
  useEffect(() => {
    fetchCatcher(
      `${FF_Paths.apiPrefix}/${
        FF_Paths.networkOrgs
      }?limit=${rowsPerPage}&count&skip=${rowsPerPage * currentPage}${
        filterString !== undefined ? filterString : ''
      }&sort=created`
    )
      .then((orgRes: IPagedOrganizationResponse) => {
        setOrgs(orgRes.items);
        setOrgTotal(orgRes.total);
      })
      .catch((err) => {
        reportFetchError(err);
      });
  }, [rowsPerPage, currentPage, filterString, reportFetchError]);

  const orgColHeaders = [
    t('name'),
    t('orgID'),
    t('identity'),
    t('messageID'),
    t('joined'),
    t(''),
  ];
  const orgRecords: IDataTableRecord[] | undefined = orgs?.map((org) => {
    return {
      key: org.id,
      columns: [
        {
          value: (
            <>
              <FFTableText
                color="primary"
                text={org.name}
                icon={<HiveIcon />}
              />
            </>
          ),
        },
        {
          value: <HashPopover shortHash={true} address={org.id} />,
        },
        {
          value: <HashPopover address={org.did} />,
        },
        {
          value: <HashPopover shortHash={true} address={org.messages.claim} />,
        },
        {
          value: (
            <FFTableText
              color="secondary"
              text={getFFTime(org.created, true)}
            />
          ),
        },
        {
          value:
            orgName === org.name ? (
              <Chip color="success" label={t('yourOrg')}></Chip>
            ) : (
              ''
            ),
        },
      ],
    };
  });

  return (
    <>
      <Header title={t('organizations')} subtitle={t('network')}></Header>
      <Grid container px={DEFAULT_PADDING}>
        <Grid container item wrap="nowrap" direction="column">
          <ChartTableHeader
            title={t('allOrganizations')}
            filter={
              <FilterButton
                filters={activeFilters}
                setFilters={setActiveFilters}
                onSetFilterAnchor={(e: React.MouseEvent<HTMLButtonElement>) =>
                  setFilterAnchor(e.currentTarget)
                }
              />
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
            records={orgRecords}
            columnHeaders={orgColHeaders}
            paginate={true}
            emptyStateText={t('noOrganizationsToDisplay')}
            dataTotal={orgTotal}
            currentPage={currentPage}
            rowsPerPage={rowsPerPage}
          />
        </Grid>
      </Grid>
      {filterAnchor && (
        <FilterModal
          anchor={filterAnchor}
          onClose={() => {
            setFilterAnchor(null);
          }}
          fields={IdentityFilters}
          addFilter={(filter: string) =>
            setActiveFilters((activeFilters) => [...activeFilters, filter])
          }
        />
      )}
    </>
  );
};
