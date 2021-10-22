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
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { Box } from '@mui/system';
import FileIcon from 'mdi-react/FileIcon';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { NamespaceContext } from '../../../core/contexts/NamespaceContext';
import {
  fetchWithCredentials,
  getNumTokensInAllAccounts,
} from '../../../core/utils';
import { registerAppNavigationItems } from '../../registration/navigation';
import { useHomeTranslation } from '../registration';

export const Home: () => JSX.Element = () => {
  const classes = useStyles();
  const { t } = useHomeTranslation();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [networkMembersTotal, setNetworkMembersTotal] = useState(0);
  const [fireflyNodesTotal, setFireflyNodesTotal] = useState(0);
  const [messagesTotal, setMessagesTotal] = useState(0);
  const [tokensTotal, setTokensTotal] = useState(0);
  const { selectedNamespace } = useContext(NamespaceContext);
  const moduleNav = registerAppNavigationItems().filter(
    (nav) => nav.translationKey !== 'home'
  );

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchWithCredentials('/api/v1/network/organizations?limit=1&count'),
      fetchWithCredentials('/api/v1/network/nodes?limit=1&count'),
      fetchWithCredentials(
        `/api/v1/namespaces/${selectedNamespace}/messages?limit=1&count`
      ),
      fetchWithCredentials(
        `/api/v1/namespaces/${selectedNamespace}/tokens/accounts?count`
      ),
    ])
      .then(
        async ([
          networkMembersResponse,
          fireflyNodesResponse,
          messagesResponse,
          accountsResponse,
        ]) => {
          if (
            networkMembersResponse.ok &&
            fireflyNodesResponse.ok &&
            messagesResponse.ok &&
            accountsResponse.ok
          ) {
            const networkMembersJson = await networkMembersResponse.json();
            const fireflyNodesJson = await fireflyNodesResponse.json();
            const messagesJson = await messagesResponse.json();
            const accountsJson = await accountsResponse.json();
            setNetworkMembersTotal(networkMembersJson.total);
            setFireflyNodesTotal(fireflyNodesJson.total);
            setMessagesTotal(messagesJson.total);
            setTokensTotal(getNumTokensInAllAccounts(accountsJson.items));
          }
        }
      )
      .finally(() => {
        setLoading(false);
      });
  }, [selectedNamespace]);

  const docsList = [
    {
      description: t('docsGettingStartedDescription'),
      icon: <FileIcon />,
      link: 'https://hyperledger.github.io/firefly/gettingstarted/gettingstarted.html',
      title: t('gettingStarted'),
    },
    {
      description: t('docsKeyConceptsDescription'),
      icon: <FileIcon />,
      link: 'https://hyperledger.github.io/firefly/keyconcepts/keyconcepts.html',
      title: t('keyConcepts'),
    },
    {
      description: t('docsArchitectureDescription'),
      icon: <FileIcon />,
      link: 'https://hyperledger.github.io/firefly/architecture/architecture.html',
      title: t('architecture'),
    },
    {
      description: t('docsHLFireflyDescription'),
      icon: <FileIcon />,
      link: 'https://hyperledger.github.io/firefly/',
      title: t('hyperledgerFireflyDocs'),
    },
    {
      description: t('docsReferenceDescription'),
      icon: <FileIcon />,
      link: 'https://hyperledger.github.io/firefly/reference/reference.html',
      title: t('reference'),
    },
  ];

  const summaryPanelList = [
    { data: networkMembersTotal, title: 'networkMembers' },
    { data: fireflyNodesTotal, title: 'fireflyNodes' },
    { data: messagesTotal, title: 'messages' },
    { data: tokensTotal, title: 'tokens' },
  ];

  const summaryPanel = (label: string, value: string | number) => (
    <Card>
      <CardContent className={classes.content}>
        <Typography noWrap className={classes.summaryLabel}>
          {label}
        </Typography>
        <Typography noWrap className={classes.summaryValue}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box className={classes.centeredContent}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Grid container justifyContent="center">
      <Grid container item wrap="nowrap" direction="column">
        <Grid container item direction="row">
          <Grid className={classes.headerContainer} item>
            <Typography variant="h4" className={classes.header}>
              {t('welcome')}
            </Typography>
          </Grid>
          <Box className={classes.separator} />
        </Grid>
        <Grid
          className={classes.cardContainer}
          spacing={4}
          container
          item
          direction="row"
        >
          {summaryPanelList.map((panel) => {
            return (
              <Grid xs={3} item key={panel.title}>
                {summaryPanel(t(panel.title), panel.data)}
              </Grid>
            );
          })}
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
                    {t('modules')}
                  </Typography>
                </Grid>
              </Grid>
              <List>
                {moduleNav.map((module, idx) => {
                  return (
                    <React.Fragment key={module.translationKey}>
                      {idx === 0 && (
                        <Divider variant="fullWidth" component="li" />
                      )}
                      <ListItem
                        sx={{ cursor: 'pointer' }}
                        alignItems="center"
                        onClick={() => {
                          history.push(module.makePathname());
                        }}
                      >
                        <ListItemAvatar>
                          <module.icon />
                        </ListItemAvatar>
                        <ListItemText
                          primary={t(module.translationKey)}
                          secondary={t(module.description || '')}
                        />
                      </ListItem>
                      <Divider variant="fullWidth" component="li" />
                    </React.Fragment>
                  );
                })}
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
                    {t('documentation')}
                  </Typography>
                </Grid>
              </Grid>
              <List>
                {docsList.map((doc, idx) => {
                  return (
                    <React.Fragment key={doc.title}>
                      {idx === 0 && (
                        <Divider variant="fullWidth" component="li" />
                      )}
                      <Link
                        sx={{ textDecoration: 'none}' }}
                        href={doc.link}
                        target="_blank"
                      >
                        <ListItem alignItems="center">
                          <ListItemAvatar>{doc.icon}</ListItemAvatar>
                          <ListItemText
                            primary={doc.title}
                            secondary={doc.description}
                          />
                        </ListItem>
                        <Divider variant="fullWidth" component="li" />
                      </Link>
                    </React.Fragment>
                  );
                })}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

const useStyles = makeStyles((theme) => ({
  cardContainer: {
    paddingBottom: theme.spacing(4),
  },
  centeredContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: 'calc(100vh - 300px)',
    overflow: 'auto',
  },
  content: {
    padding: theme.spacing(3),
  },
  header: {
    fontWeight: 'bold',
  },
  headerContainer: {
    marginBottom: theme.spacing(5),
  },
  paddingBottom: {
    paddingBottom: theme.spacing(2),
  },
  paper: {
    width: '100%',
    height: '100%',
    padding: theme.spacing(3),
  },
  separator: {
    flexGrow: 1,
  },
  summaryLabel: {
    color: theme.palette.text.secondary,
    textTransform: 'uppercase',
    fontSize: 12,
  },
  summaryValue: {
    fontSize: 32,
  },
}));
