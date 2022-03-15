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

import { Breadcrumbs, Grid, Link, Paper, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { FFCopyButton } from '../../../components/Buttons/CopyButton';
import { Header } from '../../../components/Header';
import { TxList } from '../../../components/Lists/TxList';
import { SlideSectionHeader } from '../../../components/Slides/SlideSectionHeader';
import { EventCardWrapper } from '../../../components/Timeline/Cards/EventCardWrapper';
import { OpCardWrapper } from '../../../components/Timeline/Cards/OpCardWrapper';
import { FFTimelineSpacer } from '../../../components/Timeline/TimelineItems/FFTimelineSpacer';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { SnackbarContext } from '../../../contexts/SnackbarContext';
import {
  FF_NAV_PATHS,
  FF_Paths,
  IBlockchainEvent,
  IEvent,
  IOperation,
  ITransaction,
  ITxStatus,
} from '../../../interfaces';
import { FF_TX_CATEGORY_MAP } from '../../../interfaces/enums/transactionTypes';
import { DEFAULT_PADDING, FFColors } from '../../../theme';
import { fetchCatcher, getShortHash } from '../../../utils';

export const TransactionDetails: () => JSX.Element = () => {
  const { selectedNamespace } = useContext(ApplicationContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { txID } = useParams<{ txID: string }>();
  // Transactions
  const [tx, setTx] = useState<ITransaction>();

  const [txBlockchainEvents, setTxBlockchainEvents] = useState<
    IBlockchainEvent[]
  >([]);
  const [txEvents, setTxEvents] = useState<IEvent[]>([]);
  const [txOperations, setTxOperations] = useState<IOperation[]>([]);
  const [txStatus, setTxStatus] = useState<ITxStatus>();
  const [viewTx, setViewTx] = useState<ITransaction>();
  const [viewEvent, setViewEvent] = useState<IEvent>();

  // Transaction details
  useEffect(() => {
    if (txID) {
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.transactionById(
          txID
        )}`
      )
        .then((tx: ITransaction) => {
          console.log(tx);
          setTx(tx);
        })
        .catch((err) => {
          reportFetchError(err);
        });
      // Transaction Status
      fetchCatcher(
        `${
          FF_Paths.nsPrefix
        }/${selectedNamespace}${FF_Paths.transactionByIdStatus(txID)}`
      )
        .then((txStatus: ITxStatus) => {
          setTxStatus(txStatus);
        })
        .catch((err) => {
          reportFetchError(err);
        });
      // Transaction Operations
      fetchCatcher(
        `${
          FF_Paths.nsPrefix
        }/${selectedNamespace}${FF_Paths.transactionByIdOperations(txID)}`
      )
        .then((txOperations: IOperation[]) => {
          setTxOperations(txOperations);
        })
        .catch((err) => {
          reportFetchError(err);
        });
      // Transaction events
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.events}?tx=${txID}`
      )
        .then((events: IEvent[]) => {
          setTxEvents(events);
        })
        .catch((err) => {
          reportFetchError(err);
        });
    }
  }, [txID]);

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
                {t('transactions')}
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
                {getShortHash(txID ?? '')}
                <FFCopyButton value={txID ?? ''} />
              </Typography>
            </Link>
          </Breadcrumbs>
        }
        subtitle={t('activity')}
      ></Header>
      <Grid container px={DEFAULT_PADDING}>
        <Grid
          container
          item
          direction="row"
          justifyContent="flex-center"
          alignItems="flex-start"
          xs={6}
        >
          {/* TX Card */}
          {tx && (
            <Paper
              elevation={0}
              sx={{
                width: '100%',
                backgroundColor: 'background.paper',
                padding: DEFAULT_PADDING,
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 'bold',
                  fontSize: '14',
                }}
                pb={1}
              >
                {t(FF_TX_CATEGORY_MAP[tx.type].nicename)}
              </Typography>
              <TxList tx={tx} txStatus={txStatus} showTxLink={false} />
            </Paper>
          )}
          {/* Operations */}
          <Grid container item>
            {txOperations?.length > 0 && (
              <>
                <SlideSectionHeader
                  clickPath={FF_NAV_PATHS.activityOpPath(selectedNamespace)}
                  title={t('recentOperations')}
                />
                {txOperations?.map((op, idx) => (
                  <React.Fragment key={idx}>
                    <OpCardWrapper op={op} />
                    {idx !== txOperations.length - 1 && (
                      <FFTimelineSpacer color={FFColors.White} />
                    )}
                  </React.Fragment>
                ))}
              </>
            )}
          </Grid>
        </Grid>
        {/* Operations */}
        <Grid
          container
          item
          direction="row"
          justifyContent="flex-center"
          alignItems="flex-start"
          xs={6}
        >
          {/* Events */}
          <Grid container item>
            {txEvents?.length > 0 && (
              <>
                <SlideSectionHeader
                  clickPath={FF_NAV_PATHS.blockchainEventsPath(
                    selectedNamespace
                  )}
                  title={t('recentEvents')}
                />
                {txEvents?.map((event, idx) => (
                  <React.Fragment key={idx}>
                    <EventCardWrapper
                      onHandleViewEvent={(event: IEvent) => setViewEvent(event)}
                      onHandleViewTx={(tx: ITransaction) => setViewTx(tx)}
                      link={FF_NAV_PATHS.activityTxDetailPath(
                        selectedNamespace,
                        event.tx
                      )}
                      {...{ event }}
                    />
                    {idx !== txEvents.length - 1 && (
                      <FFTimelineSpacer color={FFColors.White} />
                    )}
                  </React.Fragment>
                ))}
              </>
            )}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};
