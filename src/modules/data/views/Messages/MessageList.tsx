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
import { useHistory } from 'react-router';
import { TablePagination, makeStyles } from '@material-ui/core';
import dayjs from 'dayjs';
import {
  IMessage,
  IDataTableRecord,
  IHistory,
} from '../../../../core/interfaces';
import { DataTable } from '../../../../core/components/DataTable/DataTable';
import { HashPopover } from '../../../../core/components/HashPopover';
import { ApplicationContext } from '../../../../core/contexts/ApplicationContext';
import { NamespaceContext } from '../../../../core/contexts/NamespaceContext';
import { fetchWithCredentials } from '../../../../core/utils';
import { useDataTranslation } from '../../translations/translations';

interface Props {
  setViewMessage: React.Dispatch<React.SetStateAction<IMessage | undefined>>;
}

const PAGE_LIMITS = [10, 25];

export const MessageList: React.FC<Props> = ({ setViewMessage }) => {
  const history = useHistory<IHistory>();
  const { t } = useDataTranslation();
  const classes = useStyles();
  const { selectedNamespace } = useContext(NamespaceContext);
  const { createdFilter, lastEvent } = useContext(ApplicationContext);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(PAGE_LIMITS[0]);
  const [messages, setMessages] = useState<IMessage[]>([]);

  const columnHeaders = [
    t('author'),
    t('type'),
    t('tag'),
    t('transactionType'),
    t('dataHash'),
    t('createdOn'),
  ];

  useEffect(() => {
    let createdFilterString = `&created=>=${dayjs()
      .subtract(24, 'hours')
      .unix()}`;
    if (createdFilter === '30days') {
      createdFilterString = `&created=>=${dayjs().subtract(30, 'days').unix()}`;
    }
    if (createdFilter === '7days') {
      createdFilterString = `&created=>=${dayjs().subtract(7, 'days').unix()}`;
    }

    fetchWithCredentials(
      `/api/v1/namespaces/${selectedNamespace}/messages?limit=${rowsPerPage}&skip=${
        rowsPerPage * currentPage
      }${createdFilterString}`
    ).then(async (response) => {
      if (response.ok) {
        setMessages(await response.json());
      } else {
        console.log('error fetching messages');
      }
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
      onPageChange={handleChangePage}
      onChangeRowsPerPage={handleChangeRowsPerPage}
      rowsPerPageOptions={PAGE_LIMITS}
      labelDisplayedRows={({ from, to }) => `${from} - ${to}`}
      className={classes.pagination}
    />
  );

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
        history.replace(
          `/namespace/${selectedNamespace}/messages` + history.location.search,
          {
            viewMessage: message,
          }
        );
      },
    }));
  };

  return (
    <DataTable
      minHeight="300px"
      maxHeight="calc(100vh - 340px)"
      records={buildTableRecords(messages)}
      {...{ columnHeaders }}
      {...{ pagination }}
    />
  );
};

const useStyles = makeStyles((theme) => ({
  pagination: {
    color: theme.palette.text.secondary,
  },
}));
