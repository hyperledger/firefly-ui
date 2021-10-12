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

import React, { useState, useRef } from 'react';
import {
  Chip,
  Grid,
  Popover,
  IconButton,
  Typography,
  Theme,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import ContentCopyIcon from 'mdi-react/ContentCopyIcon';
import CopyToClipboard from 'react-copy-to-clipboard';
import clsx from 'clsx';

interface Props {
  address: string;
  textColor?: 'primary' | 'secondary';
}

export const HashPopover: React.FC<Props> = ({
  address,
  textColor = 'primary',
}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <Chip
        label={address}
        className={clsx(
          classes.chip,
          textColor === 'secondary' && classes.addressSecondaryText
        )}
        onClick={(event) => {
          event.stopPropagation();
          setOpen(!open);
        }}
        ref={anchorRef}
      />
      <Popover
        open={open}
        anchorEl={anchorRef.current}
        onBackdropClick={(event) => {
          event.stopPropagation();
          setOpen(false);
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
          className={classes.popoverContainer}
        >
          <Grid item>
            <Typography>{address}</Typography>
          </Grid>
          <Grid item>
            <CopyToClipboard text={address}>
              <IconButton className={classes.button} size="large">
                <ContentCopyIcon />
              </IconButton>
            </CopyToClipboard>
          </Grid>
        </Grid>
      </Popover>
    </>
  );
};

const useStyles = makeStyles<Theme>((theme) => ({
  chip: {
    width: 200,
    borderRadius: 2,
    backgroundColor: theme.palette.background.default,
    '&:hover, &:focus': {
      backgroundColor: theme.palette.background.default,
    },
  },
  popoverContainer: {
    padding: theme.spacing(1),
  },
  button: {
    color: theme.palette.text.primary,
    padding: 0,
  },
  addressSecondaryText: {
    color: theme.palette.text.secondary,
  },
}));
