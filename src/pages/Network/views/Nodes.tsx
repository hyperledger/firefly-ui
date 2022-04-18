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

import { Chip } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FilterButton } from '../../../components/Filters/FilterButton';
import { FilterModal } from '../../../components/Filters/FilterModal';
import { Header } from '../../../components/Header';
import { FFPageLayout } from '../../../components/Layouts/FFPageLayout';
import { HashPopover } from '../../../components/Popovers/HashPopover';
import { IdentitySlide } from '../../../components/Slides/IdentitySlide';
import { FFTableText } from '../../../components/Tables/FFTableText';
import { DataTable } from '../../../components/Tables/Table';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { FilterContext } from '../../../contexts/FilterContext';
import { SlideContext } from '../../../contexts/SlideContext';
import { SnackbarContext } from '../../../contexts/SnackbarContext';
import {
  FF_Paths,
  IDataTableRecord,
  IdentityFilters,
  IIdentity,
  INode,
  IPagedNodeResponse,
} from '../../../interfaces';
import { DEFAULT_PAGE_LIMITS } from '../../../theme';
import { fetchCatcher, getFFTime } from '../../../utils';

export const NetworkNodes: () => JSX.Element = () => {
  const { nodeName } = useContext(ApplicationContext);
  const { filterAnchor, setFilterAnchor, filterString } =
    useContext(FilterContext);
  const { setSlideSearchParam, slideID } = useContext(SlideContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const { t } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);
  // Nodes
  const [nodes, setNodes] = useState<INode[]>();
  // Node total
  const [nodeTotal, setNodeTotal] = useState(0);
  const [viewIdentity, setViewIdentity] = useState<string>();
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_PAGE_LIMITS[1]);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    if (isMounted && slideID) {
      if (slideID.startsWith('did:firefly')) {
        setViewIdentity(slideID);
      } else {
        fetchCatcher(
          `${FF_Paths.apiPrefix}/${FF_Paths.networkNodeById(slideID)}`
        )
          .then((nodeRes: IIdentity) => {
            setViewIdentity(nodeRes.did);
          })
          .catch((err) => {
            reportFetchError(err);
          });
      }
    }
  }, [slideID, isMounted]);

  // Nodes
  useEffect(() => {
    isMounted &&
      fetchCatcher(
        `${FF_Paths.apiPrefix}/${
          FF_Paths.networkNodes
        }?limit=${rowsPerPage}&count&skip=${rowsPerPage * currentPage}${
          filterString ?? ''
        }&sort=created`
      )
        .then((nodeRes: IPagedNodeResponse) => {
          if (isMounted) {
            setNodes(nodeRes.items);
            setNodeTotal(nodeRes.total);
          }
        })
        .catch((err) => {
          reportFetchError(err);
        });
  }, [rowsPerPage, currentPage, filterString, reportFetchError, isMounted]);

  const nodeColHeaders = [
    t('name'),
    t('nodeID'),
    t('orgOwner'),
    t('messageID'),
    t('created'),
    t(''),
  ];

  const nodeRecords: IDataTableRecord[] | undefined = nodes?.map((node) => {
    return {
      key: node.id,
      columns: [
        {
          value: <FFTableText color="primary" text={node.name} />,
        },
        {
          value: <HashPopover shortHash={true} address={node.id} />,
        },
        {
          value: <HashPopover address={node.did} />,
        },
        {
          value: <HashPopover shortHash={true} address={node.messages.claim} />,
        },
        {
          value: (
            <FFTableText
              color="secondary"
              text={getFFTime(node.created, true)}
            />
          ),
        },
        {
          value:
            nodeName === node.name ? (
              <Chip color="success" label={t('yourNode')}></Chip>
            ) : (
              ''
            ),
        },
      ],
      onClick: () => {
        setViewIdentity(node.did);
        setSlideSearchParam(node.did);
      },
    };
  });

  return (
    <>
      <Header
        title={t('nodes')}
        subtitle={t('network')}
        noDateFilter
        noNsFilter
      ></Header>
      <FFPageLayout>
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
          records={nodeRecords}
          columnHeaders={nodeColHeaders}
          paginate={true}
          emptyStateText={t('noNodesToDisplay')}
          dataTotal={nodeTotal}
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          filterButton={
            <FilterButton
              onSetFilterAnchor={(e: React.MouseEvent<HTMLButtonElement>) =>
                setFilterAnchor(e.currentTarget)
              }
            />
          }
        />
      </FFPageLayout>
      {filterAnchor && (
        <FilterModal
          anchor={filterAnchor}
          onClose={() => {
            setFilterAnchor(null);
          }}
          fields={IdentityFilters}
        />
      )}
      {viewIdentity && (
        <IdentitySlide
          did={viewIdentity}
          open={!!viewIdentity}
          onClose={() => {
            setViewIdentity(undefined);
            setSlideSearchParam(null);
          }}
        />
      )}
    </>
  );
};
