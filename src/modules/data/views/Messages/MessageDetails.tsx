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
import LaunchIcon from '@mui/icons-material/Launch';
import {
  Breadcrumbs,
  CircularProgress,
  Grid,
  IconButton,
  Link,
  List,
  Modal,
  Paper,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Box } from '@mui/system';
import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import Highlight from 'react-highlight';
import { useHistory, useParams } from 'react-router';
import { HashPopover } from '../../../../core/components/HashPopover';
import { NamespaceContext } from '../../../../core/contexts/NamespaceContext';
import { IBatch, IMessage } from '../../../../core/interfaces';
import { fetchWithCredentials, getShortHash } from '../../../../core/utils';
import { useDataTranslation } from '../../registration';

export const MessageDetails: () => JSX.Element = () => {
  const history = useHistory();
  const { t } = useDataTranslation();
  const { id } = useParams<{ id: string }>();
  const classes = useStyles();
  const { selectedNamespace } = useContext(NamespaceContext);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<IMessage>();
  const [batch, setBatch] = useState<IBatch>();
  const [openDataModal, setOpenDataModal] = useState(false);
  const [dataModalText, setDataModalText] = useState('');
  const handleDataModalOpen = (text: string) => {
    setDataModalText(text);
    setOpenDataModal(true);
  };
  const handleDataModalClose = () => {
    setOpenDataModal(false);
    setDataModalText('');
  };

  // Message
  useEffect(() => {
    setLoading(true);
    fetchWithCredentials(
      `/api/v1/namespaces/${selectedNamespace}/messages/${id}`
    )
      .then(async (messageResponse) => {
        if (messageResponse.ok) {
          setMessage(await messageResponse.json());
        } else {
          console.log('error fetching message');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedNamespace, id]);
  // Transaction ID
  useEffect(() => {
    message &&
      fetchWithCredentials(
        `/api/v1/namespaces/${selectedNamespace}/batches/${message.batch}`
      )
        .then(async (batchResponse) => {
          if (batchResponse.ok) {
            const batch: IBatch = await batchResponse.json();
            setBatch(batch);
          } else {
            console.log('error fetching batch');
          }
        })
        .finally(() => {
          setLoading(false);
        });
  }, [selectedNamespace, id, message]);

  if (loading) {
    return (
      <Box className={classes.centeredContent}>
        <CircularProgress />
      </Box>
    );
  }

  if (!message) {
    return <></>;
  }

  const detailsData = [
    {
      label: t('id'),
      value: <HashPopover address={message.header.id}></HashPopover>,
    },
    {
      label: t('type'),
      value: message?.header.type,
    },
    { label: t('topic'), value: message.header.topics.join(',') },
    {
      label: t('author'),
      value: <HashPopover address={message.header.author}></HashPopover>,
    },
    {
      label: t('dataHash'),
      value: <HashPopover address={message.header.datahash}></HashPopover>,
    },
    {
      label: t('transactionID'),
      value: batch?.payload.tx.id && (
        <>
          <HashPopover address={batch.payload.tx.id}></HashPopover>
          <IconButton
            className={classes.button}
            size="large"
            onClick={() => {
              history.push(
                `/namespace/${selectedNamespace}/data/transactions/${batch.payload.tx.id}`
              );
            }}
          >
            <LaunchIcon />
          </IconButton>
        </>
      ),
    },

    {
      label: t('createdOn'),
      value: dayjs(message.header.created).format('MM/DD/YYYY h:mm A'),
    },
  ];

  return (
    <Grid container justifyContent="center">
      <Grid container item wrap="nowrap" direction="column">
        <Grid item>
          <Breadcrumbs className={classes.paddingBottom}>
            <Link
              underline="hover"
              color="inherit"
              sx={{ cursor: 'pointer' }}
              onClick={() =>
                history.push(`/namespace/${selectedNamespace}/data/messages`)
              }
            >
              {t('messages')}
            </Link>
            <Link underline="none" color="text.primary">
              {getShortHash(message.header.id)}
            </Link>
          </Breadcrumbs>
        </Grid>
        <Box className={classes.separator} />
        <Grid
          item
          container
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          className={classes.paddingBottom}
        >
          <Typography className={classes.bold} variant="h4">
            {t('messageDetails')}
          </Typography>
        </Grid>
        <Grid container spacing={4} item direction="row">
          <Grid item xs={6}>
            <Paper className={classes.paper}>
              <Grid
                container
                justifyContent="space-between"
                direction="row"
                className={classes.paddingBottom}
              >
                <Grid item>
                  <Typography className={classes.header}>
                    {t('details')}
                  </Typography>
                </Grid>
              </Grid>
              <List>
                <Grid container spacing={2}>
                  {detailsData.map((data) => {
                    return (
                      <React.Fragment key={data.label}>
                        <Grid item xs={4}>
                          <Typography
                            noWrap
                            color="text.secondary"
                            variant="body1"
                          >
                            {data.label}
                          </Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <Typography noWrap>{data.value}</Typography>
                        </Grid>
                      </React.Fragment>
                    );
                  })}
                </Grid>
              </List>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper className={classes.paper}>
              <Grid
                container
                justifyContent="space-between"
                direction="row"
                className={classes.paddingBottom}
              >
                <Grid item>
                  <Typography className={classes.header}>
                    {t('dataAttachments')}
                  </Typography>
                </Grid>
              </Grid>
              <List>
                <Grid container spacing={2}>
                  {batch?.payload.data.map((data) => {
                    return (
                      <React.Fragment key={data.id}>
                        <Paper
                          elevation={3}
                          className={classes.paperAttachment}
                          onClick={() => handleDataModalOpen(data.value || '')}
                        >
                          <Grid item className={classes.container}>
                            <Grid item>
                              <Typography noWrap className={classes.title}>
                                {t('id')}: {data.id}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography
                                noWrap
                                className={classes.description}
                              >
                                {t('hash')}: {data.hash}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Paper>
                        <Modal
                          open={openDataModal}
                          onClose={handleDataModalClose}
                          aria-labelledby="modal-modal-title"
                          aria-describedby="modal-modal-description"
                          className={classes.dataContainer}
                        >
                          <Paper sx={modalStyle}>
                            <Highlight>
                              {JSON.stringify(dataModalText, null, 2)}
                            </Highlight>
                          </Paper>
                        </Modal>
                      </React.Fragment>
                    );
                  })}
                </Grid>
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

const useStyles = makeStyles((theme) => ({
  centeredContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: 'calc(100vh - 300px)',
    overflow: 'auto',
  },
  dataContainer: {
    overflow: 'auto',
  },
  header: {
    fontWeight: 'bold',
  },
  paper: {
    width: '100%',
    height: '100%',
    padding: theme.spacing(3),
  },
  separator: {
    flexGrow: 1,
  },
  bold: {
    fontWeight: 'bold',
  },
  paddingBottom: {
    paddingBottom: theme.spacing(2),
  },
  paddingRight: {
    paddingRight: theme.spacing(2),
  },
  paperAttachment: {
    backgroundColor: '#2D353C',
    padding: theme.spacing(2),
    width: '100%',
    cursor: 'pointer',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  description: {
    fontSize: 12,
  },
  container: {
    alignItems: 'flex-start',
  },
  copyButton: {
    backgroundColor: theme.palette.primary.dark,
    borderRadius: 20,
    fontSize: 12,
  },
  button: {
    color: theme.palette.text.primary,
    padding: 0,
    paddingLeft: theme.spacing(1),
  },
}));

const modalStyle = {
  position: 'absolute' as const,
  overflow: 'auto',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '40%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
