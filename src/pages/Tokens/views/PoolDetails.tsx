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

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {
  Breadcrumbs,
  Grid,
  IconButton,
  Link,
  Paper,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Jazzicon from 'react-jazzicon';
import { useNavigate, useParams } from 'react-router-dom';
import { FFCopyButton } from '../../../components/Buttons/CopyButton';
import { FireFlyCard } from '../../../components/Cards/FireFlyCard';
import { getCreatedFilter } from '../../../components/Filters/utils';
import { Header } from '../../../components/Header';
import { PoolList } from '../../../components/Lists/PoolList';
import { HashPopover } from '../../../components/Popovers/HashPopover';
import { EventSlide } from '../../../components/Slides/EventSlide';
import { OperationSlide } from '../../../components/Slides/OperationSlide';
import { TransactionSlide } from '../../../components/Slides/TransactionSlide';
import { TransferSlide } from '../../../components/Slides/TransferSlide';
import { MediumCardTable } from '../../../components/Tables/MediumCardTable';
import { DataTable } from '../../../components/Tables/Table';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { SnackbarContext } from '../../../contexts/SnackbarContext';
import {
  FF_NAV_PATHS,
  FF_Paths,
  FF_TRANSFER_CATEGORY_MAP,
  ICreatedFilter,
  IDataTableRecord,
  IEvent,
  IOperation,
  IPagedTokenTransferResponse,
  ITokenBalance,
  ITokenPool,
  ITokenTransfer,
  ITransaction,
  TransferIconMap,
} from '../../../interfaces';
import { DEFAULT_PADDING, DEFAULT_PAGE_LIMITS } from '../../../theme';
import { fetchCatcher, getShortHash, jsNumberForAddress } from '../../../utils';

export const PoolDetails: () => JSX.Element = () => {
  const { createdFilter, selectedNamespace } = useContext(ApplicationContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { poolID } = useParams<{ poolID: string }>();
  // Pools
  const [pool, setPool] = useState<ITokenPool>();

  const [viewTx, setViewTx] = useState<ITransaction>();
  const [viewTransfer, setViewTransfer] = useState<ITokenTransfer>();
  const [viewEvent, setViewEvent] = useState<IEvent>();
  const [viewOp, setViewOp] = useState<IOperation>();

  // Token transfers
  const [tokenTransfers, setTokenTransfers] = useState<ITokenTransfer[]>();
  // Token Transfer totals
  const [tokenTransferTotal, setTokenTransferTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_PAGE_LIMITS[0]);
  // Pool accounts
  const [poolAccounts, setPoolAccounts] = useState<ITokenBalance[]>();

  useEffect(() => {
    if (poolID) {
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.tokenPoolsById(
          poolID
        )}`
      )
        .then((pool: ITokenPool) => {
          setPool(pool);
        })
        .catch((err) => {
          reportFetchError(err);
        });
    }
  }, [poolID]);

  // Pool balances
  useEffect(() => {
    if (pool) {
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.tokenBalances}?pool=${pool?.id}`
      )
        .then((balances: ITokenBalance[]) => {
          setPoolAccounts(balances);
        })
        .catch((err) => {
          reportFetchError(err);
        });
    }
  }, [poolID, pool]);

  // Token transfers and accounts
  useEffect(() => {
    const createdFilterObject: ICreatedFilter = getCreatedFilter(createdFilter);
    fetchCatcher(
      `${FF_Paths.nsPrefix}/${selectedNamespace}${
        FF_Paths.tokenTransfers
      }?limit=${rowsPerPage}&count&skip=${rowsPerPage * currentPage}${
        createdFilterObject.filterString
      }&pool=${pool?.id}`
    )
      .then((tokenTransferRes: IPagedTokenTransferResponse) => {
        setTokenTransfers(tokenTransferRes.items);
        setTokenTransferTotal(tokenTransferRes.total);
      })
      .catch((err) => {
        reportFetchError(err);
      });
  }, [rowsPerPage, currentPage, selectedNamespace, pool]);

  const poolAccountsColHeaders = [t('key'), t('balance'), t('lastUpdated')];
  const poolAccountsRecords: IDataTableRecord[] | undefined = poolAccounts?.map(
    (account) => ({
      key: account.key,
      columns: [
        {
          value: <HashPopover address={account.key} />,
        },
        {
          value: <Typography>{account.balance}</Typography>,
        },
        {
          value: dayjs(account.updated).format('MM/DD/YYYY h:mm A'),
        },
      ],
    })
  );

  const accountsCard = {
    headerText: t('accountsInPool'),
    component: (
      <MediumCardTable
        records={poolAccountsRecords}
        columnHeaders={poolAccountsColHeaders}
        emptyMessage={t('noTokenAccounts')}
        stickyHeader={true}
      ></MediumCardTable>
    ),
  };

  const tokenTransferColHeaders = [
    t('activity'),
    t('from'),
    t('to'),
    t('amount'),
    t('blockchainEvent'),
    t('author'),
    t('timestamp'),
  ];
  const tokenTransferRecords: IDataTableRecord[] | undefined =
    tokenTransfers?.map((transfer) => ({
      key: transfer.localId,
      columns: [
        {
          value: (
            <>
              <Grid
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                container
              >
                <Grid container item justifyContent="flex-start" xs={2}>
                  {TransferIconMap[transfer.type]}
                </Grid>
                <Grid container item justifyContent="flex-start" xs={10}>
                  <Typography>
                    {t(FF_TRANSFER_CATEGORY_MAP[transfer.type].nicename)}
                  </Typography>
                </Grid>
              </Grid>
            </>
          ),
        },
        {
          value: (
            <HashPopover
              shortHash={true}
              address={transfer.from ?? t('nullAddress')}
            ></HashPopover>
          ),
        },
        {
          value: (
            <HashPopover
              shortHash={true}
              address={transfer.to ?? t('nullAddress')}
            ></HashPopover>
          ),
        },
        {
          value: <Typography>{transfer.amount}</Typography>,
        },
        {
          value: (
            <HashPopover
              shortHash={true}
              address={transfer.blockchainEvent}
            ></HashPopover>
          ),
        },
        {
          value: (
            <HashPopover shortHash={true} address={transfer.key}></HashPopover>
          ),
        },
        { value: dayjs(transfer.created).format('MM/DD/YYYY h:mm A') },
      ],
      onClick: () => setViewTransfer(transfer),
      leftBorderColor: FF_TRANSFER_CATEGORY_MAP[transfer.type].color,
    }));

  return (
    <>
      <Header
        title={
          <Breadcrumbs>
            <Link
              underline="hover"
              color="inherit"
              sx={{ cursor: 'pointer' }}
              onClick={() =>
                navigate(FF_NAV_PATHS.activityTxPath(selectedNamespace))
              }
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 'bold',
                  fontSize: '14',
                }}
              >
                {t('tokenPools')}
              </Typography>
            </Link>
            <Link underline="none" color="text.primary">
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 'bold',
                  fontSize: '14',
                }}
              >
                {getShortHash(pool?.name ?? '')}
                <FFCopyButton value={pool?.name ?? ''} />
              </Typography>
            </Link>
          </Breadcrumbs>
        }
        subtitle={t('activity')}
      ></Header>
      <Grid container px={DEFAULT_PADDING}>
        {/* Left hand side */}
        <Grid
          container
          item
          direction="row"
          justifyContent="flex-center"
          alignItems="flex-start"
          xs={6}
          pr={DEFAULT_PADDING}
        >
          {/* Pool Card */}
          {pool && (
            <Paper
              elevation={0}
              sx={{
                width: '100%',
                backgroundColor: 'background.paper',
                padding: DEFAULT_PADDING,
              }}
            >
              <Grid
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                container
              >
                <Grid container item justifyContent="flex-start" xs={2}>
                  <Jazzicon diameter={34} seed={jsNumberForAddress(pool.id)} />
                </Grid>
                <Grid container item justifyContent="flex-start" xs={10}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 'bold',
                      fontSize: '14',
                    }}
                    pb={1}
                  >
                    {pool.name}
                  </Typography>
                </Grid>
                <PoolList pool={pool} showPoolLink={false} />
              </Grid>
            </Paper>
          )}
        </Grid>
        {/* Right hand side */}
        <Grid
          pl={DEFAULT_PADDING}
          container
          item
          direction="row"
          justifyContent="flex-center"
          alignItems="flex-start"
          xs={6}
        >
          {/* Events */}
          <Grid
            direction="column"
            alignItems="center"
            justifyContent="center"
            container
            item
            height="100%"
          >
            <FireFlyCard height="100%" card={accountsCard} />
          </Grid>
        </Grid>
        <Grid item pt={3} container>
          <DataTable
            header={t('transfersInPool')}
            onHandleCurrPageChange={(currentPage: number) =>
              setCurrentPage(currentPage)
            }
            onHandleRowsPerPage={(rowsPerPage: number) =>
              setRowsPerPage(rowsPerPage)
            }
            stickyHeader={true}
            minHeight="300px"
            maxHeight="calc(100vh - 340px)"
            records={tokenTransferRecords}
            columnHeaders={tokenTransferColHeaders}
            paginate={true}
            emptyStateText={t('noTokenTransfersToDisplay')}
            dataTotal={tokenTransferTotal}
            currentPage={currentPage}
            rowsPerPage={rowsPerPage}
            headerBtn={
              <IconButton
                onClick={() =>
                  navigate(FF_NAV_PATHS.tokensTransfersPath(selectedNamespace))
                }
              >
                <ArrowForwardIcon />
              </IconButton>
            }
          />
        </Grid>
      </Grid>
      {viewTx && (
        <TransactionSlide
          transaction={viewTx}
          open={!!viewTx}
          onClose={() => {
            setViewTx(undefined);
          }}
        />
      )}
      {viewEvent && (
        <EventSlide
          event={viewEvent}
          open={!!viewEvent}
          onClose={() => {
            setViewEvent(undefined);
          }}
        />
      )}
      {viewOp && (
        <OperationSlide
          op={viewOp}
          open={!!viewOp}
          onClose={() => {
            setViewOp(undefined);
          }}
        />
      )}
      {viewTransfer && (
        <TransferSlide
          transfer={viewTransfer}
          open={!!viewTransfer}
          onClose={() => {
            setViewTransfer(undefined);
          }}
        />
      )}
    </>
  );
};
