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

import {
  CircularProgress,
  Grid,
  Paper,
  Popover,
  Typography,
} from '@mui/material';
import { ResponsiveNetwork } from '@nivo/network';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import { SnackbarContext } from '../../contexts/SnackbarContext';
import { INode, IOrganization } from '../../interfaces';
import { FF_Paths } from '../../interfaces/constants';
import { DEFAULT_BORDER_RADIUS, DEFAULT_PADDING, FFColors } from '../../theme';
import { fetchCatcher, getFFTime } from '../../utils';
import { HashPopover } from '../Popovers/HashPopover';

interface Props {
  size: 'small' | 'medium' | 'large';
}

const NODE_STRING_DELIM = '||';
const SIZE_MAP = {
  small: {
    node: 24,
    org: 36,
    distance: 60,
  },
  medium: {
    node: 90,
    org: 125,
    distance: 200,
  },
  large: {
    node: 140,
    org: 200,
    distance: 300,
  },
};
export const NetworkMap: React.FC<Props> = ({ size }) => {
  const { t } = useTranslation();
  const { selectedNamespace } = useContext(ApplicationContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const [orgs, setOrgs] = useState<IOrganization[]>();
  const [nodes, setNodes] = useState<INode[]>();
  const [networkMapData, setNetworkMapData] = useState<{
    nodes: any[];
    links: any[];
  }>({
    nodes: [],
    links: [],
  });

  const tooltipLabelArr = [t('name'), t('did'), t('id'), t('updated')];
  const [anchorPosition, setAnchorPosition] = useState<{
    top: number;
    left: number;
  }>();
  const [popoverNode, setPopoverNode] = useState<any>(undefined);
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (node: any, event: any) => {
    setAnchorPosition({
      top: node.x,
      left: node.y,
    });
    setAnchorEl(event.currentTarget);
    setPopoverNode(node);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setPopoverNode(undefined);
  };
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  useEffect(() => {
    fetchCatcher(
      `${FF_Paths.nsPrefix}/${selectedNamespace}/${FF_Paths.networkOrgs}`
    )
      .then((orgRes: IOrganization[]) => {
        setOrgs(orgRes);
      })
      .catch((err) => {
        reportFetchError(err);
      });
    fetchCatcher(
      `${FF_Paths.nsPrefix}/${selectedNamespace}/${FF_Paths.networkNodes}`
    )
      .then((nodeRes: INode[]) => {
        setNodes(nodeRes);
      })
      .catch((err) => {
        reportFetchError(err);
      });
  }, [selectedNamespace]);

  useEffect(() => {
    createNodeArray();
  }, [orgs, nodes]);

  const makeNodeID = (node: IOrganization | INode): string => {
    return `${node.name}${NODE_STRING_DELIM}${node.did}${NODE_STRING_DELIM}${node.id}${NODE_STRING_DELIM}${node.updated}`;
  };

  const createNodeArray = () => {
    const linksArr: any[] = [];
    const nodeArr: any[] = [];
    orgs?.map((o) => {
      // Add org node
      nodeArr.push({
        id: makeNodeID(o),
        height: 3,
        size: SIZE_MAP[size].org,
        color: FFColors.Yellow,
      });
      // Get all org's nodes
      const orgNodes = nodes?.filter((n) => n.parent === o.id);
      // Add org's nodes
      orgNodes?.map((n) => {
        nodeArr.push({
          id: makeNodeID(n),
          height: 2,
          size: SIZE_MAP[size].node,
          color: FFColors.Orange,
        });

        linksArr.push({
          source: makeNodeID(o),
          target: makeNodeID(n),
          distance: SIZE_MAP[size].distance,
        });
      });
    });

    setNetworkMapData({
      nodes: nodeArr,
      links: linksArr,
    });
  };

  const makePopoverContent = () => {
    return (
      <Grid
        direction="row"
        container
        width={400}
        sx={{
          borderRadius: DEFAULT_BORDER_RADIUS,
          opacity: '0.92 !important',
          backgroundColor: 'background.paper',
          maxWidth: 400,
          border: `1px solid`,
          borderColor: 'primary.main',
        }}
        p={DEFAULT_PADDING}
      >
        {popoverNode?.id
          ?.split(NODE_STRING_DELIM)
          .map((key: any, idx: number) => {
            return (
              <Grid
                container
                item
                alignItems="center"
                direction="row"
                pb={1}
                key={idx}
              >
                <Grid
                  xs={6}
                  container
                  item
                  justifyContent="flex-start"
                  alignItems="center"
                >
                  <Typography variant="body1">
                    {`${tooltipLabelArr[idx].toUpperCase()}:`}
                  </Typography>
                </Grid>
                <Grid
                  xs={6}
                  container
                  item
                  justifyContent="flex-end"
                  alignItems="center"
                >
                  <HashPopover
                    address={idx === 3 ? getFFTime(key, true) : key}
                  />
                </Grid>
              </Grid>
            );
          })}
      </Grid>
    );
  };

  const getRepulsivity = (numOrgs: number) => {
    switch (numOrgs) {
      case 2:
        return size === 'small' ? 50 : 80;
      case 3:
        return size === 'small' ? 34 : 170;
      case 4:
        return size === 'small' ? 10 : 28;
      case 5:
        return size === 'small' ? 17 : 60;
      default:
        if (numOrgs > 10) {
          return 3.2;
        }
        return 50;
    }
  };

  const getCenteringStrength = (numOrgs: number) => {
    switch (numOrgs) {
      case 2:
        return 1;
      case 3:
        return size === 'small' ? 1 : 1;
      case 4:
        return size === 'small' ? 1 : 1;
      case 5:
        return size === 'small' ? 1 : 1;
      default:
        return 1;
    }
  };

  const content =
    !orgs || !nodes ? (
      <Grid container justifyContent="center" alignItems="center">
        <CircularProgress color="warning" />
      </Grid>
    ) : (
      <ResponsiveNetwork
        data={networkMapData}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        linkDistance={(e: any) => {
          return e.distance;
        }}
        centeringStrength={getCenteringStrength(orgs.length)}
        repulsivity={getRepulsivity(orgs.length)}
        nodeSize={(n: any) => {
          return n.size;
        }}
        activeNodeSize={(n: any) => {
          return 1.1 * n.size;
        }}
        inactiveNodeSize={(n: any) => {
          return 0.9 * n.size;
        }}
        nodeColor={(e: any) => {
          return e.color;
        }}
        nodeBorderWidth={0}
        linkThickness={(n: any) => {
          return 1 + 1 * n.target.data.height;
        }}
        linkColor={'#9BA7B0'}
        animate
        onClick={handleClick}
        nodeTooltip={({ node }) => {
          return (
            <Paper
              sx={{
                borderRadius: DEFAULT_BORDER_RADIUS,
                padding: 1,
                color: 'text.primary',
                background: 'secondary.dark',
              }}
            >
              <Typography>{node?.id?.split(NODE_STRING_DELIM)[0]}</Typography>
            </Paper>
          );
        }}
      />
    );

  return (
    <Grid container sx={{ width: '100%', height: '98%', cursor: 'pointer' }}>
      {content}
      {anchorPosition && (
        <Popover
          id={id}
          open={popoverNode ? true : false}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'center',
            horizontal: 'center',
          }}
        >
          {makePopoverContent()}
        </Popover>
      )}
    </Grid>
  );
};
