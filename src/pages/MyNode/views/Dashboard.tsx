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

import { Grid, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Header } from '../../../components/Header';
import { FFTextField } from '../../../components/Inputs/FFTextField';
import { FFCircleLoader } from '../../../components/Loaders/FFCircleLoader';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { SnackbarContext } from '../../../contexts/SnackbarContext';
import { FF_Paths, INode, IOrganization } from '../../../interfaces';
import { DEFAULT_PADDING, DEFAULT_SPACING } from '../../../theme';
import { fetchCatcher } from '../../../utils';

export const MyNodeDashboard: () => JSX.Element = () => {
  const { nodeID, orgID } = useContext(ApplicationContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const { t } = useTranslation();

  // Node
  const [node, setNode] = useState<INode>();
  // Org
  const [org, setOrg] = useState<IOrganization>();

  // Nodes and Orgs
  useEffect(() => {
    fetchCatcher(`${FF_Paths.apiPrefix}/${FF_Paths.networkNodeById(nodeID)}`)
      .then((nodeRes: INode) => {
        setNode(nodeRes);
      })
      .catch((err) => {
        reportFetchError(err);
      });
    fetchCatcher(`${FF_Paths.apiPrefix}/${FF_Paths.networkOrgById(orgID)}`)
      .then((orgRes: IOrganization) => {
        setOrg(orgRes);
      })
      .catch((err) => {
        reportFetchError(err);
      });
  }, [nodeID, orgID]);

  const nodeInputs = [
    {
      defaultValue: node?.name ?? '',
      label: t('name'),
    },
    {
      defaultValue: node?.owner ?? '',
      label: t('orgOwner'),
    },
    {
      defaultValue: node?.id ?? '',
      label: t('id'),
    },
  ];

  const orgInputs = [
    {
      defaultValue: org?.name ?? '',
      label: t('name'),
    },
    {
      defaultValue: org?.identity ?? '',
      label: t('identity'),
    },
    {
      defaultValue: org?.id ?? '',
      label: t('id'),
    },
  ];

  const dxInputs = [
    {
      defaultValue: node?.dx.peer ?? '',
      label: t('peer'),
    },
    {
      defaultValue: node?.dx.endpoint.id ?? '',
      label: t('endpointID'),
    },
    {
      defaultValue: node?.dx.endpoint.endpoint ?? '',
      label: t('endpoint'),
    },
    {
      defaultValue: node?.dx.endpoint.cert ?? '',
      label: t('certificate'),
    },
  ];

  return (
    <>
      <Header title={t('dashboard')} subtitle={t('myNode')}></Header>
      <Grid container px={DEFAULT_PADDING}>
        <Grid
          container
          item
          direction="column"
          justifyContent="center"
          alignItems="flex-start"
        >
          {!(node && org) ? (
            <FFCircleLoader color="warning" />
          ) : (
            <>
              {/* Node */}
              <Grid item container spacing={DEFAULT_SPACING}>
                {/* Node Title */}
                <Grid item xs={12}>
                  <Typography sx={{ fontWeight: 'bold' }} variant="h6">
                    {t('node')}
                  </Typography>
                </Grid>
                {/* Node Details */}
                {nodeInputs.map((input) => (
                  <Grid item xs={4}>
                    <FFTextField
                      key={input.defaultValue}
                      defaultValue={input.defaultValue}
                      label={input.label}
                      hasCopyBtn
                    />
                  </Grid>
                ))}
              </Grid>
              {/* Org */}
              <Grid
                item
                container
                spacing={DEFAULT_SPACING}
                pt={DEFAULT_PADDING}
              >
                {/* Org Title */}
                <Grid item xs={12}>
                  <Typography sx={{ fontWeight: 'bold' }} variant="h6">
                    {t('organization')}
                  </Typography>
                </Grid>
                {/* Org Details */}
                {orgInputs.map((input) => (
                  <Grid item xs={4}>
                    <FFTextField
                      key={input.defaultValue}
                      defaultValue={input.defaultValue}
                      label={input.label}
                      hasCopyBtn
                    />
                  </Grid>
                ))}
              </Grid>
              {/* Data Exchange */}
              <Grid
                item
                container
                spacing={DEFAULT_SPACING}
                pt={DEFAULT_PADDING}
              >
                {/* DX Title */}
                <Grid item xs={12}>
                  <Typography sx={{ fontWeight: 'bold' }} variant="h6">
                    {t('dataExchange')}
                  </Typography>
                </Grid>
                {/* DX Details */}
                {dxInputs.map((input) => (
                  <Grid item xs={3}>
                    <FFTextField
                      key={input.defaultValue}
                      defaultValue={input.defaultValue}
                      label={input.label}
                      hasCopyBtn
                    />
                  </Grid>
                ))}
              </Grid>
            </>
          )}
        </Grid>
      </Grid>
    </>
  );
};
