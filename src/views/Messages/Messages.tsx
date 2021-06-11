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

import React, { useState, useEffect, useContext } from 'react';
import {
  Grid,
  Typography,
  TablePagination,
  Box,
  CircularProgress,
  makeStyles,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import {
  IDataTableRecord,
  ITimelineItem,
  IMessage,
  IHistory,
} from '../../interfaces';
import { DataTable } from '../../components/DataTable/DataTable';
import { DataTimeline } from '../../components/DataTimeline/DataTimeline';
import { HashPopover } from '../../components/HashPopover';
import { MessageDetails } from './MessageDetails';
import BroadcastIcon from 'mdi-react/BroadcastIcon';
import { NamespaceContext } from '../../contexts/NamespaceContext';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import { DataViewSwitch } from '../../components/DataViewSwitch';
import { useHistory } from 'react-router-dom';
import { FilterSelect } from '../../components/FilterSelect';

const PAGE_LIMITS = [10, 25];

export const Messages: React.FC = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const history = useHistory<IHistory>();
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [viewMessage, setViewMessage] = useState<IMessage | undefined>();
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(PAGE_LIMITS[0]);
  const { selectedNamespace } = useContext(NamespaceContext);
  const { dataView, createdFilter, setCreatedFilter, lastEvent } =
    useContext(ApplicationContext);

  const createdQueryOptions = [
    {
      value: '24hours',
      label: t('last24Hours'),
    },
    {
      value: '7days',
      label: t('last7Days'),
    },
    {
      value: '30days',
      label: t('last30Days'),
    },
  ];

  useEffect(() => {
    setLoading(true);
    let createdFilterString = `&created=>=${dayjs()
      .subtract(24, 'hours')
      .unix()}`;
    if (createdFilter === '30days') {
      createdFilterString = `&created=>=${dayjs().subtract(30, 'days').unix()}`;
    }
    if (createdFilter === '7days') {
      createdFilterString = `&created=>=${dayjs().subtract(7, 'days').unix()}`;
    }

    fetch(
      `/api/v1/namespaces/${selectedNamespace}/messages?limit=${rowsPerPage}&skip=${
        rowsPerPage * currentPage
      }${createdFilterString}`
    )
      .then(async (response) => {
        if (response.ok) {
          setMessages(await response.json());
        } else {
          console.log('error fetching messages');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [rowsPerPage, currentPage, selectedNamespace, createdFilter, lastEvent]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCurrentPage(0);
    setRowsPerPage(+event.target.value);
  };

  const pagination = (
    <TablePagination
      component="div"
      count={-1}
      rowsPerPage={rowsPerPage}
      page={currentPage}
      onChangePage={handleChangePage}
      onChangeRowsPerPage={handleChangeRowsPerPage}
      rowsPerPageOptions={PAGE_LIMITS}
      labelDisplayedRows={({ from, to }) => `${from} - ${to}`}
      className={classes.pagination}
    />
  );

  const columnHeaders = [
    t('author'),
    t('type'),
    t('tag'),
    t('transactionType'),
    t('dataHash'),
    t('createdOn'),
  ];

  const buildTableRecords = (messages: IMessage[]): IDataTableRecord[] => {
    return messages.map((message: IMessage) => ({
      key: message.header.id,
      columns: [
        {
          value: (
            <HashPopover
              textColor="secondary"
              address={message.header.author}
            />
          ),
        },
        { value: message.header.type },
        { value: message.header.tag },
        { value: message.header.txtype },
        {
          value: (
            <HashPopover
              textColor="secondary"
              address={message.header.datahash}
            />
          ),
        },
        { value: dayjs(message.header.created).format('MM/DD/YYYY h:mm A') },
      ],
      onClick: () => {
        setViewMessage(message);
        history.replace('/messages', { viewMessage: message });
      },
    }));
  };

  const buildTimelineElements = (messages: IMessage[]): ITimelineItem[] => {
    return messages.map((message: IMessage) => ({
      key: message.header.id,
      title: message.header.type,
      description: message.header.tag,
      author: message.header.author,
      time: dayjs(message.header.created).format('MM/DD/YYYY h:mm A'),
      icon: <BroadcastIcon />,
      onClick: () => {
        setViewMessage(message);
        history.replace('/messages', { viewMessage: message });
      },
    }));
  };

  if (loading) {
    return (
      <Box className={classes.centeredContent}>
        <CircularProgress />
      </Box>
    );
  }

  // make sure to view MessageDetails panel if it was open when navigating to a linked page and user goes back
  if (history.location.state && !viewMessage) {
    setViewMessage(history.location.state.viewMessage);
  }

  return (
    <>
      <Grid container wrap="nowrap" direction="column" className={classes.root}>
        <Grid container spacing={2} item direction="row" alignItems="center">
          <Grid item>
            <Typography className={classes.header} variant="h4">
              {t('messages')}
            </Typography>
          </Grid>
          <Box className={classes.separator} />
          <Grid item>
            <FilterSelect
              filter={createdFilter}
              setFilter={setCreatedFilter}
              filterItems={createdQueryOptions}
            />
          </Grid>
          <Grid item>
            <DataViewSwitch />
          </Grid>
        </Grid>
        {dataView === 'timeline' && (
          <Grid className={classes.timelineContainer} xs={12} container item>
            <DataTimeline items={buildTimelineElements(messages)} />
          </Grid>
        )}
        {dataView === 'list' && (
          <Grid container item>
            <DataTable
              minHeight="300px"
              maxHeight="calc(100vh - 340px)"
              records={buildTableRecords(messages)}
              {...{ columnHeaders }}
              {...{ pagination }}
            />
          </Grid>
        )}
      </Grid>
      {viewMessage && (
        <MessageDetails
          open={!!viewMessage}
          onClose={() => {
            setViewMessage(undefined);
            history.replace('/messages', undefined);
          }}
          message={viewMessage}
        />
      )}
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: 20,
    paddingLeft: 120,
    paddingRight: 120,
    [theme.breakpoints.down('sm')]: {
      flexWrap: 'wrap',
    },
  },
  header: {
    fontWeight: 'bold',
  },
  pagination: {
    color: theme.palette.text.secondary,
  },
  centeredContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: 'calc(100vh - 300px)',
    overflow: 'auto',
  },
  timelineContainer: {
    paddingTop: theme.spacing(4),
  },
  separator: {
    flexGrow: 1,
  },
}));
