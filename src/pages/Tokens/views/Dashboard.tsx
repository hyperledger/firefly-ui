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
import { Chip, Divider, Grid, IconButton, Typography } from '@mui/material';
import { BarDatum } from '@nivo/bar';
import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Jazzicon from 'react-jazzicon';
import { useNavigate } from 'react-router-dom';
import { CardEmptyState } from '../../../components/Cards/CardEmptyState';
import { MediumCard } from '../../../components/Cards/MediumCard';
import { SmallCard } from '../../../components/Cards/SmallCard';
import { Histogram } from '../../../components/Charts/Histogram';
import { getCreatedFilter } from '../../../components/Filters/utils';
import { Header } from '../../../components/Header';
import { FFCircleLoader } from '../../../components/Loaders/FFCircleLoader';
import { HashPopover } from '../../../components/Popovers/HashPopover';
import { TransferSlide } from '../../../components/Slides/TransferSlide';
import { DataTable } from '../../../components/Tables/Table';
import { DataTableEmptyState } from '../../../components/Tables/TableEmptyState';
import { IDataTableRecord } from '../../../components/Tables/TableInterfaces';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { SnackbarContext } from '../../../contexts/SnackbarContext';
import {
  BucketCollectionEnum,
  BucketCountEnum,
  FF_Paths,
  ICreatedFilter,
  IGenericPagedResponse,
  IMediumCard,
  IMetricType,
  ISmallCard,
  ITokenAccount,
  ITokenPool,
  ITokenTransfer,
  TransferKeyEnum,
} from '../../../interfaces';
import { TransferIconMap } from '../../../interfaces/tables';
import { DEFAULT_PADDING, DEFAULT_SPACING, FFColors } from '../../../theme';
import { fetchCatcher, jsNumberForAddress } from '../../../utils';
import {
  isTransferHistogramEmpty,
  makeTransferHistogram,
} from '../../../utils/histograms/transferHistogram';
import VisibilityIcon from '@mui/icons-material/Visibility';

export const TokensDashboard: () => JSX.Element = () => {
  const { t } = useTranslation();
  const { createdFilter, lastEvent, orgName, selectedNamespace } =
    useContext(ApplicationContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const navigate = useNavigate();
  // Small cards
  // Tokens
  const [tokenTransfersCount, setTokenTransfersCount] = useState<number>();
  const [tokenMintCount, setTokenMintcount] = useState<number>();
  const [tokenBurnCount, setTokenBurnCount] = useState<number>();
  const [tokenErrorCount, setTokenErrorCount] = useState<number>(0);
  // Accounts
  const [tokenAccountsCount, setTokenAccountsCount] = useState<number>();
  // Pools
  const [tokenPoolCount, setTokenPoolCount] = useState<number>();
  const [tokenPoolErrorCount, setTokenPoolErrorCount] = useState<number>(0);
  // Connectors
  const [tokenConnectorCount, setTokenConnectorCount] = useState<number>();

  // Medium cards
  // Transfer types histogram
  const [transferHistData, setTransferHistData] = useState<BarDatum[]>();
  // Token accounts
  const [tokenAccounts, setTokenAccounts] = useState<ITokenAccount[]>([]);
  // Token pools
  const [tokenPools, setTokenPools] = useState<ITokenPool[]>([]);
  // Token transfers
  const [tokenTransfers, setTokenTransfers] = useState<ITokenTransfer[]>([]);
  // View transfer slide out
  const [viewTransfer, setViewTransfer] = useState<
    ITokenTransfer | undefined
  >();

  const smallCards: ISmallCard[] = [
    {
      header: t('tokens'),
      numErrors: tokenErrorCount,
      data: [
        { header: t('transfers'), data: tokenTransfersCount },
        { header: t('mint'), data: tokenMintCount },
        { header: t('burn'), data: tokenBurnCount },
      ],
    },
    {
      header: t('accounts'),
      numErrors: 0,
      data: [{ header: t('total'), data: tokenAccountsCount }],
    },
    {
      header: t('tokenPools'),
      numErrors: tokenPoolErrorCount,
      data: [{ header: t('total'), data: tokenPoolCount }],
    },
    {
      header: t('connectors'),
      numErrors: 0,
      data: [{ header: t('total'), data: tokenConnectorCount }],
    },
  ];

  // Small Card UseEffect
  useEffect(() => {
    const createdFilterObject: ICreatedFilter = getCreatedFilter(createdFilter);
    const qParams = `?count=true&limit=1${createdFilterObject.filterString}`;

    Promise.all([
      // Tokens
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.tokenTransfers}${qParams}&type=transfer`
      ),
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.tokenTransfers}${qParams}&type=mint`
      ),
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.tokenTransfers}${qParams}&type=burn`
      ),
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.operations}${qParams}&type=token_create_pool&type=token_activate_pool&type=token_transfer&status=Failed`
      ),
      // Accounts
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.tokenAccounts}${qParams}`
      ),
      // Pools
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.tokenPools}?count=true&limit=1`
      ),
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.operations}${qParams}&type=token_create_pool&type=token_activate_pool&status=Failed`
      ),
      // Connectors
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.tokenConnectors}?count=true&limit=1`
      ),
    ])
      .then(
        ([
          // Transfers
          tokensTransfer,
          tokensMint,
          tokensBurn,
          tokenErrors,
          // Accounts
          tokenAccounts,
          // Pools
          tokenPools,
          tokenPoolErrors,
          // Connectors
          tokenConnectors,
        ]: IGenericPagedResponse[] | any[]) => {
          // Transfers
          setTokenTransfersCount(tokensTransfer.total);
          setTokenMintcount(tokensMint.total);
          setTokenBurnCount(tokensBurn.total);
          setTokenErrorCount(tokenErrors.total);
          // Accounts
          setTokenAccountsCount(tokenAccounts.total);
          // Pools
          setTokenPoolCount(tokenPools.total);
          setTokenPoolErrorCount(tokenPoolErrors.total);
          // Connectors
          setTokenConnectorCount(tokenConnectors.length);
        }
      )
      .catch((err) => {
        reportFetchError(err);
      });
  }, [selectedNamespace, createdFilter, lastEvent, createdFilter]);

  const tokenAccountsColHeaders = [t('key'), t('')];
  const tokenAccountRecords = (): IDataTableRecord[] => {
    return tokenAccounts?.map((acct) => {
      return {
        key: acct.key,
        columns: [
          {
            value: (
              <>
                <Typography noWrap>{acct.key}</Typography>
              </>
            ),
          },
          { value: <ArrowForwardIcon /> },
        ],
      };
    });
  };

  const tokenPoolColHeaders = [t('name'), t('created')];
  const tokenPoolRecords = (): IDataTableRecord[] => {
    return tokenPools?.map((pool) => {
      return {
        key: pool.id,
        columns: [
          {
            value: (
              <>
                <Grid
                  direction="row"
                  justifyContent="flex-start"
                  alignItems="center"
                >
                  <Jazzicon
                    diameter={20}
                    seed={jsNumberForAddress(pool.name)}
                  />
                  <Typography flexWrap="wrap">{pool.name}</Typography>
                </Grid>
              </>
            ),
          },
          { value: dayjs(pool.created).format('MM/DD/YYYY h:mm A') },
        ],
      };
    });
  };

  const mediumCards: IMediumCard[] = [
    {
      headerText: t('tokenTransferTypes'),
      headerComponent: (
        <IconButton onClick={() => navigate('transfers')}>
          <ArrowForwardIcon />
        </IconButton>
      ),
      component: !transferHistData ? (
        <FFCircleLoader color="warning"></FFCircleLoader>
      ) : isTransferHistogramEmpty(transferHistData) ? (
        <CardEmptyState text={t('noEvents')}></CardEmptyState>
      ) : (
        <Histogram
          colors={[FFColors.Yellow, FFColors.Orange, FFColors.Pink]}
          data={transferHistData}
          indexBy="timestamp"
          keys={[
            TransferKeyEnum.MINT,
            TransferKeyEnum.TRANSFER,
            TransferKeyEnum.BURN,
          ]}
          includeLegend={true}
        ></Histogram>
      ),
    },
    {
      headerText: t('accounts'),
      headerComponent: (
        <IconButton onClick={() => navigate('accounts')}>
          <ArrowForwardIcon />
        </IconButton>
      ),
      component: (
        <Grid container justifyContent="center" alignItems="center">
          <Grid xs={12}>
            <Typography color="secondary">{t('key')}</Typography>
          </Grid>
          {tokenAccounts.map((acct) => {
            return (
              <>
                <Grid
                  container
                  justifyContent="center"
                  alignItems="center"
                  pt={DEFAULT_PADDING}
                >
                  <Grid item xs={11}>
                    <Typography sx={{ fontWeight: 'bold' }} color="primary">
                      {acct.key}
                    </Typography>
                  </Grid>
                  <Grid item xs={1} justifyContent="center">
                    <IconButton>
                      <VisibilityIcon />
                    </IconButton>
                  </Grid>
                </Grid>
                <Divider />
              </>
            );
          })}
        </Grid>
      ),
    },
    {
      headerText: t('tokenPools'),
      headerComponent: (
        <IconButton onClick={() => navigate('pools')}>
          <ArrowForwardIcon />
        </IconButton>
      ),
      component: (
        <Grid container justifyContent="center" alignItems="center">
          {tokenPools.map((pool) => {
            return (
              <>
                <Grid
                  container
                  justifyContent="center"
                  alignItems="center"
                  pt={DEFAULT_PADDING}
                  direction="row"
                >
                  <Grid direction="row" container item xs={6}>
                    <Jazzicon
                      diameter={25}
                      seed={jsNumberForAddress(pool.name)}
                    />
                    <Typography
                      pl={DEFAULT_PADDING}
                      sx={{ fontWeight: 'bold' }}
                      color="primary"
                    >
                      {pool.name}
                    </Typography>
                  </Grid>
                  <Grid direction="row" container item xs={4}>
                    <Typography pl={DEFAULT_PADDING} color="primary">
                      {pool.standard}
                    </Typography>
                  </Grid>
                  <Grid item xs={2} container justifyContent="center">
                    <IconButton>
                      <VisibilityIcon />
                    </IconButton>
                  </Grid>
                </Grid>
                <Divider />
              </>
            );
          })}
        </Grid>
      ),
    },
  ];

  // Medium Card UseEffect
  useEffect(() => {
    fetchCatcher(
      `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.tokenPools}`
    )
      .then((pools: ITokenPool[]) => {
        setTokenPools(pools);
      })
      .catch((err) => {
        reportFetchError(err);
      });
    fetchCatcher(
      `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.tokenAccounts}`
    )
      .then((accounts: ITokenAccount[]) => {
        setTokenAccounts(accounts);
      })
      .catch((err) => {
        reportFetchError(err);
      });
  }, [selectedNamespace, createdFilter, lastEvent, createdFilter]);

  // Histogram
  useEffect(() => {
    const currentTime = dayjs().unix();
    const createdFilterObject: ICreatedFilter = getCreatedFilter(createdFilter);

    fetchCatcher(
      `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.chartsHistogram(
        BucketCollectionEnum.TokenTransfers
      )}?startTime=${
        createdFilterObject.filterTime
      }&endTime=${currentTime}&buckets=${BucketCountEnum.Small}`
    )
      .then((histTypes: IMetricType[]) => {
        setTransferHistData(makeTransferHistogram(histTypes));
      })
      .catch((err) => {
        reportFetchError(err);
      });
  }, [selectedNamespace, createdFilter, lastEvent, createdFilter]);

  const tokenTransferColHeaders = [
    t('activity'),
    t('from'),
    t('to'),
    t('blockchainEvent'),
    t('author'),
    t('details'),
    t('timestamp'),
    t('status'),
  ];
  const tokenTransferRecords = (): IDataTableRecord[] => {
    return tokenTransfers?.map((transfer) => {
      return {
        key: transfer.localId,
        columns: [
          {
            value: (
              <>
                <Grid container justifyContent="flex-start" alignItems="center">
                  {TransferIconMap[transfer.type]}{' '}
                  <Typography pl={DEFAULT_PADDING} variant="body1">
                    {transfer.type.toUpperCase()}
                  </Typography>
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
            value: (
              <HashPopover
                shortHash={true}
                address={transfer.blockchainEvent}
              ></HashPopover>
            ),
          },
          {
            value: (
              <HashPopover
                shortHash={true}
                address={transfer.key}
              ></HashPopover>
            ),
          },
          { value: 'TODO' },
          { value: dayjs(transfer.created).format('MM/DD/YYYY h:mm A') },
          { value: <Chip color="success" label="TODO"></Chip> }, //TODO: Make Dynamic
        ],
        onClick: () => setViewTransfer(transfer),
      };
    });
  };

  // Recent token transfers
  useEffect(() => {
    const createdFilterObject: ICreatedFilter = getCreatedFilter(createdFilter);

    fetchCatcher(
      `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.tokenTransfers}?limit=5${createdFilterObject.filterString}`
    )
      .then((tokenTransfers: ITokenTransfer[]) => {
        setTokenTransfers(tokenTransfers);
      })
      .catch((err) => {
        reportFetchError(err);
      });
  }, [selectedNamespace, createdFilter, lastEvent, createdFilter]);

  return (
    <>
      <Header title={t('dashboard')} subtitle={t('tokens')}></Header>
      <Grid container px={DEFAULT_PADDING}>
        <Grid container item wrap="nowrap" direction="column">
          {/* Small Cards */}
          <Grid
            spacing={DEFAULT_SPACING}
            container
            item
            direction="row"
            pb={DEFAULT_PADDING}
          >
            {smallCards.map((card) => {
              return (
                <Grid
                  key={card.header}
                  xs={DEFAULT_PADDING}
                  direction="column"
                  alignItems="center"
                  justifyContent="center"
                  container
                  item
                >
                  <SmallCard card={card} />
                </Grid>
              );
            })}
          </Grid>
          {/* Medium Cards */}
          <Grid
            spacing={DEFAULT_SPACING}
            container
            justifyContent="center"
            alignItems="flex-start"
            direction="row"
            pb={DEFAULT_PADDING}
          >
            {mediumCards.map((card) => {
              return (
                <Grid
                  key={card.headerText}
                  direction="column"
                  justifyContent="center"
                  container
                  item
                  xs={4}
                >
                  <MediumCard card={card} position="flex-start" />
                </Grid>
              );
            })}
          </Grid>
          {/* Recent Transfers */}
          {!tokenTransfers ? (
            <FFCircleLoader color="warning"></FFCircleLoader>
          ) : tokenTransfers.length ? (
            <DataTable
              header={t('recentTokenTransfers')}
              stickyHeader={true}
              minHeight="300px"
              maxHeight="calc(100vh - 340px)"
              records={tokenTransferRecords()}
              columnHeaders={tokenTransferColHeaders}
            />
          ) : (
            <DataTableEmptyState
              message={t('noTokenTransfersToDisplay')}
            ></DataTableEmptyState>
          )}
        </Grid>
      </Grid>
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
