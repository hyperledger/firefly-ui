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

import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import dayjs from 'dayjs';
import CheckboxBlankCircleIcon from 'mdi-react/CheckboxBlankCircleIcon';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { HistogramSparkChart } from '../../../core/components/Charts/HistogramSparkChart';
import {
  mapPieChartData,
  PieChart,
} from '../../../core/components/Charts/PieChart';
import { DatePicker } from '../../../core/components/DatePicker';
import { ApplicationContext } from '../../../core/contexts/ApplicationContext';
import {
  FFColors,
  ICreatedFilter,
  IGenericPagedResponse,
  IMetric,
  IPieChartElement,
  MSGStatus,
  TXStatus,
} from '../../../core/interfaces';
import { fetchWithCredentials, getCreatedFilter } from '../../../core/utils';
import { useDataTranslation } from '../registration';

interface IChartPanel {
  chart: JSX.Element;
  data: IPieChartElement[] | undefined;
  title: string;
}

interface ISummaryPanel {
  metrics: IMetric[];
  title: string;
  total: string | undefined;
}

const MSG_STATUS_COLORS: { [key in MSGStatus]: string } = {
  confirmed: FFColors.Blue,
  ready: FFColors.Yellow,
  pending: FFColors.Yellow,
  staged: FFColors.Yellow,
  rejected: FFColors.Red,
};
const TX_STATUS_COLORS: { [key in TXStatus]: string } = {
  Succeeded: FFColors.Blue,
  Pending: FFColors.Yellow,
  Error: FFColors.Red,
};

export const Dashboard: () => JSX.Element = () => {
  const classes = useStyles();
  const { t } = useDataTranslation();
  // Totals
  const [messagesTotal, setMessagesTotal] = useState(undefined);
  const [txTotal, setTxTotal] = useState(undefined);
  const [eventsTotal, setEventsTotal] = useState(undefined);
  // Latest data for pie charts
  const [latestMsgs, setLatestMsgs] = useState<
    IGenericPagedResponse[] | undefined
  >(undefined);
  const [latestTx, setLatestTx] = useState<IGenericPagedResponse[] | undefined>(
    undefined
  );
  // Metrics
  const [msgMetrics, setMsgMetrics] = useState<IMetric[]>([]);
  const [txMetrics, setTxMetrics] = useState<IMetric[]>([]);
  const [eventsMetrics, setEventsMetrics] = useState<IMetric[]>([]);
  const { lastEvent, createdFilter } = useContext(ApplicationContext);
  const { namespace } = useParams<{ namespace: string }>();

  useEffect(() => {
    const createdFilterObject: ICreatedFilter = getCreatedFilter(createdFilter);
    // Total counts
    Promise.all([
      fetchWithCredentials(
        `/api/v1/namespaces/${namespace}/messages?count${createdFilterObject.filterString}&limit=1`
      ),
      fetchWithCredentials(
        `/api/v1/namespaces/${namespace}/transactions?count${createdFilterObject.filterString}&limit=1`
      ),
      fetchWithCredentials(
        `/api/v1/namespaces/${namespace}/events?count${createdFilterObject.filterString}&limit=1`
      ),
    ]).then(async ([messageResponse, txResponse, eventsResponse]) => {
      if (messageResponse.ok && txResponse.ok && eventsResponse.ok) {
        const messageJson = await messageResponse.json();
        const txJson = await txResponse.json();
        const eventsJson = await eventsResponse.json();
        setMessagesTotal(messageJson.total);
        setTxTotal(txJson.total);
        setEventsTotal(eventsJson.total);
      }
    });
    // Messages Pie Chart
    const msgStatusObject: { [key: string]: string } = MSGStatus;
    const msgEnums: string[] = Object.keys(MSGStatus).map(
      (key: string) => msgStatusObject[key]
    );
    Promise.all(
      msgEnums.map((e) =>
        fetchWithCredentials(
          `/api/v1/namespaces/${namespace}/messages?count${createdFilterObject.filterString}&limit=1&state=${e}`
        )
      )
    ).then(async (msgStatusResponses) => {
      if (msgStatusResponses.every((e) => e.ok)) {
        const msgStatusResponseJsons: IGenericPagedResponse[] = [];
        for (let i = 0; i < msgStatusResponses.length; i++) {
          await msgStatusResponseJsons.push(await msgStatusResponses[i].json());
        }
        setLatestMsgs(msgStatusResponseJsons);
      }
    });
    // Tx Pie Chart
    const txStatusObject: { [key: string]: string } = TXStatus;
    const txEnums = Object.keys(TXStatus).map(
      (key: string) => txStatusObject[key]
    );
    Promise.all(
      txEnums.map((e) =>
        fetchWithCredentials(
          `/api/v1/namespaces/${namespace}/transactions?count${createdFilterObject.filterString}&limit=1&status=${e}`
        )
      )
    ).then(async (txStatusResponses) => {
      if (txStatusResponses.every((e) => e.ok)) {
        const txStatusResponseJsons: IGenericPagedResponse[] = [];
        for (let i = 0; i < txStatusResponses.length; i++) {
          await txStatusResponseJsons.push(await txStatusResponses[i].json());
        }
        setLatestTx(txStatusResponseJsons);
      }
    });
  }, [namespace, lastEvent, createdFilter]);

  useEffect(() => {
    const currentTime = dayjs().unix();
    const createdFilterObject: ICreatedFilter = getCreatedFilter(createdFilter);
    // Metrics
    Promise.all([
      fetchWithCredentials(
        `/api/v1/namespaces/${namespace}/charts/histogram/messages?startTime=${createdFilterObject.filterTime}&endTime=${currentTime}&buckets=40`
      ),
      fetchWithCredentials(
        `/api/v1/namespaces/${namespace}/charts/histogram/transactions?startTime=${createdFilterObject.filterTime}&endTime=${currentTime}&buckets=40`
      ),
      fetchWithCredentials(
        `/api/v1/namespaces/${namespace}/charts/histogram/events?startTime=${createdFilterObject.filterTime}&endTime=${currentTime}&buckets=40`
      ),
    ]).then(
      async ([
        msgMetricsResponse,
        txMetricsResponse,
        eventsMetricsResponse,
      ]) => {
        if (
          msgMetricsResponse.ok &&
          txMetricsResponse.ok &&
          eventsMetricsResponse.ok
        ) {
          const msgMetricsJson = await msgMetricsResponse.json();
          const txMetricsJson = await txMetricsResponse.json();
          const eventsMetricsJson = await eventsMetricsResponse.json();
          setMsgMetrics(msgMetricsJson);
          setTxMetrics(txMetricsJson);
          setEventsMetrics(eventsMetricsJson);
        }
      }
    );
  }, [namespace, lastEvent, createdFilter]);

  const summaryPanels: ISummaryPanel[] = [
    {
      metrics: msgMetrics,
      title: t('messages'),
      total: messagesTotal,
    },
    {
      metrics: txMetrics,
      title: t('transactions'),
      total: txTotal,
    },
    {
      metrics: eventsMetrics,
      title: t('events'),
      total: eventsTotal,
    },
  ];

  const chartPanels: IChartPanel[] = [
    {
      chart:
        latestMsgs !== undefined ? (
          <PieChart
            data={mapPieChartData(latestMsgs, MSG_STATUS_COLORS, MSGStatus)}
            dataType={t('messages')}
          ></PieChart>
        ) : (
          <CircularProgress />
        ),
      data:
        latestMsgs && mapPieChartData(latestMsgs, MSG_STATUS_COLORS, MSGStatus),
      title: t('latestMessages'),
    },
    {
      chart:
        latestTx !== undefined ? (
          <>
            <PieChart
              data={mapPieChartData(latestTx, TX_STATUS_COLORS, TXStatus)}
              dataType={t('transactions')}
            ></PieChart>
          </>
        ) : (
          <CircularProgress />
        ),
      data: latestTx && mapPieChartData(latestTx, TX_STATUS_COLORS, TXStatus),
      title: t('latestTransactions'),
    },
  ];

  const pieChartPanel = (data: IChartPanel): JSX.Element => (
    <Paper className={classes.paper}>
      <Grid container justifyContent="space-between" direction="row">
        <Grid item>
          <Typography className={classes.header}>{data.title}</Typography>
        </Grid>
      </Grid>
      <Grid className={classes.pieChartHeight}>{data.chart}</Grid>
      <Grid className={classes.pieChartDetailsHeight}>
        {data.data?.map((d) => {
          return (
            <>
              <Grid container direction="row">
                <Grid
                  container
                  item
                  xs={6}
                  spacing={2}
                  direction="row"
                  justifyContent="flex-start"
                  alignItems="center"
                >
                  <Grid color={d.color} item>
                    <CheckboxBlankCircleIcon />
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle1">{d.label}</Typography>
                  </Grid>
                </Grid>
                <Grid
                  container
                  item
                  xs={6}
                  spacing={2}
                  direction="row"
                  justifyContent="flex-end"
                  alignItems="center"
                >
                  <Grid item>
                    <Typography variant="subtitle1">{d.value}</Typography>
                  </Grid>
                </Grid>
              </Grid>
            </>
          );
        })}
      </Grid>
    </Paper>
  );

  const summaryPanel = (data: ISummaryPanel): JSX.Element => (
    <Card sx={{ height: '140px', width: '100%' }}>
      <CardContent className={classes.content}>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="flex-start"
        >
          <Grid item xs={6}>
            <Typography align="left" noWrap className={classes.summaryLabel}>
              {data.title}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography
              align="right"
              alignItems="flex-start"
              noWrap
              className={classes.summaryValue}
            >
              {data.total !== undefined ? data.total : <CircularProgress />}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
      <Grid container sx={{ height: '45px', width: '100%' }}>
        <HistogramSparkChart
          colors={[FFColors.Blue]}
          data={data.metrics}
          indexBy={'timestamp'}
          keys={['count']}
        />
      </Grid>
    </Card>
  );

  return (
    <Grid container justifyContent="center">
      <Grid container item wrap="nowrap" direction="column">
        <Grid container item direction="row">
          <Grid className={classes.headerContainer} item>
            <Typography variant="h4" className={classes.header}>
              {t('dashboard')}
            </Typography>
          </Grid>
          <Box className={classes.separator} />
          <Grid item>
            <DatePicker />
          </Grid>
        </Grid>
        <Grid
          className={classes.cardContainer}
          spacing={4}
          container
          item
          direction="row"
        >
          {summaryPanels.map((panel: ISummaryPanel, idx: number) => {
            return (
              <Grid sm={12} md={6} lg={3} item key={idx}>
                {summaryPanel(panel)}
              </Grid>
            );
          })}
        </Grid>
        <Grid container item direction="row" spacing={6}>
          {chartPanels.map((panel: IChartPanel, idx: number) => {
            return (
              <Grid
                container
                item
                md={12}
                lg={4}
                key={idx}
                className={classes.chartPanel}
              >
                {pieChartPanel(panel)}
              </Grid>
            );
          })}
        </Grid>
      </Grid>
    </Grid>
  );
};

const useStyles = makeStyles((theme) => ({
  header: {
    fontWeight: 'bold',
  },
  headerContainer: {
    marginBottom: theme.spacing(5),
  },
  summaryLabel: {
    color: theme.palette.text.secondary,
    textTransform: 'uppercase',
    fontSize: 12,
  },
  summaryValue: {
    fontSize: 32,
  },
  paper: {
    width: '100%',
    height: '100%',
    padding: theme.spacing(3),
  },
  pieChartHeight: {
    width: '100%',
    height: '65%',
    padding: theme.spacing(1),
  },
  pieChartDetailsHeight: {
    width: '100%',
    height: '35%',
    padding: theme.spacing(1),
    overflow: 'auto',
  },
  content: {
    paddingTop: theme.spacing(3),
  },
  cardContainer: {
    paddingBottom: theme.spacing(4),
  },
  separator: {
    flexGrow: 1,
  },
  chartPanel: {
    minHeight: '600px',
    maxHeight: 'calc(100vh - 340px)',
  },
}));
