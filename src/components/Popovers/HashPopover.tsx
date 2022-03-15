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

import { Chip, Grid, IconButton, Popover, Typography } from '@mui/material';
import ContentCopyIcon from 'mdi-react/ContentCopyIcon';
import React, { useRef, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { theme } from '../../App';
import { DEFAULT_BORDER_RADIUS } from '../../theme';
import { getShortHash } from '../../utils';

interface Props {
  address: string;
  shortHash?: boolean;
  fullLength?: boolean;
  textColor?: 'primary' | 'secondary';
  paper?: boolean;
}

export const HashPopover: React.FC<Props> = ({
  address,
  shortHash,
  textColor = 'primary',
  paper,
  fullLength,
}) => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <Chip
        label={shortHash ? getShortHash(address) : address}
        sx={{
          width: fullLength ? '100%' : shortHash ? 110 : 200,
          color:
            textColor === 'secondary'
              ? theme.palette.text.secondary
              : undefined,
          borderRadius: DEFAULT_BORDER_RADIUS,
          backgroundColor: paper
            ? theme.palette.background.paper
            : theme.palette.background.default,
          '&:hover, &:focus': {
            backgroundColor: paper
              ? theme.palette.background.paper
              : theme.palette.background.default,
          },
        }}
        onClick={(event) => {
          event.stopPropagation();
          setOpen(!open);
        }}
        ref={anchorRef}
      />
      <Popover
        sx={{ zIndex: (theme) => theme.zIndex.tooltip + 1 }}
        open={open}
        anchorEl={anchorRef.current}
        onBackdropClick={(event) => {
          event.stopPropagation();
          setOpen(false);
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Grid
          alignItems="center"
          spacing={1}
          container
          direction="row"
          sx={{ padding: theme.spacing(1) }}
        >
          <Grid item>
            <Typography>{address}</Typography>
          </Grid>
          <Grid item>
            <CopyToClipboard text={address}>
              <IconButton
                sx={{ color: theme.palette.text.primary, padding: 0 }}
                size="large"
              >
                <ContentCopyIcon />
              </IconButton>
            </CopyToClipboard>
          </Grid>
        </Grid>
      </Popover>
    </>
  );
};
