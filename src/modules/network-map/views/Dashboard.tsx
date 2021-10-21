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

import { CircularProgress, Grid, Typography } from '@mui/material';
import { useNetworkMapTranslation } from '../registration';
import {
  ResponsiveCirclePacking,
  CircleProps,
  LabelProps,
} from '@nivo/circle-packing';
import { fetchCatcher } from '../../../core/utils';
import { useQuery } from 'react-query';
import { INode, IOrganization } from '../../../core/interfaces';
import { HashPopover } from '../../../core/components/HashPopover';
import dayjs from 'dayjs';
import { StyledTooltip } from '../../../core/components/StyledTooltip';
import { DATUM, NODE_VALUE, IDENTITY_VALUE, HARDCODED_DATA } from './constants';

export const Dashboard: () => JSX.Element = () => {
  const { t } = useNetworkMapTranslation();

  const getOrgsApi = '/api/v1/network/organizations';
  const getOrgsFn = () => fetchCatcher(getOrgsApi);
  const { data: orgs, isLoading: orgsLoading } = useQuery<IOrganization[]>(
    getOrgsApi,
    getOrgsFn
  );

  const getNodesApi = '/api/v1/network/nodes';
  const getNodesFn = () => fetchCatcher(getNodesApi);
  const { data: nodes, isLoading: nodesLoading } = useQuery<INode[]>(
    getNodesApi,
    getNodesFn
  );

  const labelComponent: (props: LabelProps<DATUM>) => JSX.Element = (p) => {
    const isOrg = p.node.depth === 1; // || dummy for hardcoded data - should be removed
    const isNode = p.node.depth === 2 && p.node.value === NODE_VALUE;
    const isIdentity = p.node.depth === 2 && p.node.value === IDENTITY_VALUE;
    if (isIdentity) return <></>; // identities dont get labels
    const org = isOrg
      ? orgs?.find((o) => o.id === p.node.id) || {
          id: 'e26aaa9e-8c4b-4232-a0b5-5e5867a2ddb3',
          name: p.label,
        }
      : undefined;
    const node = isNode
      ? nodes?.find((n) => n.id === p.node.id) || {
          name: p.label,
        }
      : undefined;
    return (
      <>
        <text
          style={{
            fill: 'white',
            fontWeight: 'bolder',
            fontSize: isOrg ? '18px' : '10px',
          }}
          x={p.node.x}
          y={p.node.y - p.node.radius - 12}
          textAnchor="middle"
          dominantBaseline="central"
        >
          {isOrg ? org?.name : node?.name}
        </text>
        {/* code to show the org id is below */}
        {/* {isOrg && org && (
          <text
            style={{
              fill: 'white',
              fontWeight: 'bolder',
              fontSize: '12px',
              outline: '1px solid white',
              outlineOffset: '3px',
            }}
            x={p.node.x}
            y={p.node.y - p.node.radius / 1.25}
            textAnchor="middle"
            dominantBaseline="central"
          >
            {`${org.id.slice(0, 5)}...${org.id.slice(
              org.id.length - 5,
              org.id.length
            )}`}
          </text>
        )} */}
      </>
    );
  };

  const circleComponent: (props: CircleProps<DATUM>) => JSX.Element = (p) => {
    const isOrg = p.node.depth === 1;
    const isNode = p.node.depth === 2 && p.node.value === NODE_VALUE;
    const isIdentity = p.node.depth === 2 && p.node.value === IDENTITY_VALUE;
    let fill = '';
    if (isOrg) {
      fill = "url('#orgGradient')";
    } else if (isNode) {
      fill = "url('#nodeGradient')";
    } else if (isIdentity) {
      fill = "url('#identityGradient')";
    } else {
      fill = "url('#containerGradient')";
    }

    const makeTooltipDataRow = (title: string, value: JSX.Element) => (
      <Grid
        item
        container
        direction="row"
        justifyContent="space-between"
        spacing={3}
        alignItems="center"
      >
        <Grid item>
          <Typography variant="body1">{title}</Typography>
        </Grid>
        <Grid item>{value}</Grid>
      </Grid>
    );

    const makeTooltipComponent = () => {
      const node = nodes?.find((n) => n.id === p.node.id);

      // || p.node.id below is for testing hardcoded data
      return (
        <Grid item container direction="column" spacing={1}>
          <Grid item>
            <Typography variant="overline" fontWeight="bold">
              {isNode ? t('node') : t('identity')}
            </Typography>
          </Grid>
          {makeTooltipDataRow(
            isNode ? t('name') : t('id'),
            <>
              {isNode && (
                <Typography variant="body2">
                  {node?.name || p.node.id}
                </Typography>
              )}
              {isIdentity && (
                <HashPopover textColor="secondary" address={p.node.id} />
              )}
            </>
          )}
          {isNode &&
            makeTooltipDataRow(
              t('nodeId'),
              <HashPopover
                textColor="secondary"
                address={node?.id || p.node.id || ''}
              />
            )}
          {isNode &&
            makeTooltipDataRow(
              t('created'),
              <Typography variant="body2">
                {dayjs(node?.created).format('MM/DD/YYYY h:mm A')}
              </Typography>
            )}
        </Grid>
      );
    };

    const tooltipWrap = (children: JSX.Element) => (
      <StyledTooltip title={makeTooltipComponent()} arrow placement="right">
        {children}
      </StyledTooltip>
    );

    const circle = (
      <svg>
        <defs>
          <radialGradient id="containerGradient">
            <stop offset="100%" stopColor="#1E242A" />
          </radialGradient>
          <radialGradient id="orgGradient">
            <stop offset="52%" stopColor="#252C32" />
            <stop offset="85%" stopColor="#816a15" />
          </radialGradient>
          <radialGradient id="nodeGradient">
            <stop offset="20%" stopColor="#FFFEE9" />
            <stop offset="30%" stopColor="#FFCA00" />
            <stop offset="50%" stopColor="#727e87" />
            <stop offset="90%" stopColor="#FFCA00" />
          </radialGradient>
          <radialGradient id="identityGradient">
            <stop offset="50%" stopColor="#FFCA00" />
            <stop offset="90%" stopColor="#727e87" />
          </radialGradient>
        </defs>
        <circle
          cx={p.node.x}
          cy={p.node.y}
          r={p.node.radius}
          fill={fill}
        ></circle>
      </svg>
    );

    return isNode || isIdentity ? tooltipWrap(circle) : circle;
  };

  const orgMap: Map<IOrganization, INode[] | undefined> = new Map();
  orgs?.forEach((o) =>
    orgMap.set(
      o,
      nodes?.filter((n) => n.owner === o.identity)
    )
  );

  const networkData: DATUM = {
    id: 'network-map',
    children: [],
  };
  orgMap.forEach((n, o) => {
    networkData.children.push({
      id: o.id,
      children: (
        n?.map((node) => ({
          id: node.id,
          value: NODE_VALUE,
        })) || []
      ).concat({
        id: o.identity,
        value: IDENTITY_VALUE,
      }),
    });
  });

  const useHardcodedData = false; // testing
  const isDense =
    useHardcodedData || (orgs?.length || 0) > 4 || (nodes?.length || 0) > 6
      ? true
      : false;

  const content =
    orgsLoading || nodesLoading ? (
      <CircularProgress />
    ) : (
      <ResponsiveCirclePacking
        data={useHardcodedData ? HARDCODED_DATA : networkData}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        padding={isDense ? 150 : 450}
        labelComponent={labelComponent}
        circleComponent={circleComponent}
        enableLabels={true}
        labelsFilter={function (e) {
          return e.node.depth >= 1;
        }}
        labelsSkipRadius={isDense ? 10 : 5}
      />
    );

  return (
    <Grid container item wrap="nowrap" direction="column" spacing={3}>
      <Grid item>
        <Typography variant="h4" fontWeight="bold">
          {t('dashboard')}
        </Typography>
      </Grid>
      <Grid item height="85vh">
        {content}
      </Grid>
    </Grid>
  );
};
