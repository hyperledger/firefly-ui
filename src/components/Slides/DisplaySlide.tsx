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

import { IconButton, Modal, Paper, Slide } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import CloseIcon from 'mdi-react/CloseIcon';
import React from 'react';
import { DEFAULT_PADDING } from '../../theme';

export interface Props {
  open: boolean;
  onClose: () => void;
}

export const DisplaySlide: React.FC<Props> = ({ children, open, onClose }) => {
  const classes = useStyles();

  return (
    <>
      <Modal {...{ open }} {...{ onClose }}>
        <Slide direction="left" in={open} mountOnEnter unmountOnExit>
          <Paper square elevation={0} className={classes.paper}>
            <IconButton
              onClick={onClose}
              className={classes.close}
              size="large"
            >
              <CloseIcon />
            </IconButton>
            {children}
          </Paper>
        </Slide>
      </Modal>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  paper: {
    backgroundColor: theme.palette.background.default,
    height: '100vh',
    outline: 'none',
    width: '40vw',
    marginLeft: '60vw',
    overflowY: 'auto',
    padding: 3,
  },
  close: {
    position: 'absolute',
    right: theme.spacing(DEFAULT_PADDING),
    top: theme.spacing(DEFAULT_PADDING),
    color: theme.palette.text.primary,
  },
}));
