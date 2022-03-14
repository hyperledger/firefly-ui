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
import CloseIcon from 'mdi-react/CloseIcon';
import React from 'react';
import { theme } from '../../App';
import { DEFAULT_PADDING } from '../../theme';

export interface Props {
  open: boolean;
  onClose: () => void;
}

export const DisplaySlide: React.FC<Props> = ({ children, open, onClose }) => {
  return (
    <>
      <Modal {...{ open }} {...{ onClose }}>
        <Slide direction="left" in={open} mountOnEnter unmountOnExit>
          <Paper
            square
            elevation={0}
            sx={{
              backgroundColor: theme.palette.background.default,
              height: '100vh',
              outline: 'none',
              width: '45vw',
              marginLeft: '55vw',
              overflowY: 'auto',
              padding: 3,
            }}
          >
            <IconButton
              onClick={onClose}
              sx={{
                position: 'absolute',
                right: theme.spacing(DEFAULT_PADDING),
                top: theme.spacing(DEFAULT_PADDING),
                color: theme.palette.text.primary,
              }}
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
