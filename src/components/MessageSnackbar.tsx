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

import React, { useEffect, useRef, useState } from 'react';
import {
  IconButton,
  makeStyles,
  Slide,
  Snackbar,
  Theme,
} from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import AlertCircleIcon from 'mdi-react/AlertCircleIcon';
import CloseIcon from 'mdi-react/CloseIcon';
import CheckIcon from 'mdi-react/CheckIcon';

const TRANSITION_TIMEOUT = 400;
export type SnackbarMessageType = 'error' | 'success';

interface MessageSnackbarProps {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  messageType?: SnackbarMessageType;
}

function SlideTransition(props: TransitionProps) {
  return <Slide {...props} direction="up" timeout={TRANSITION_TIMEOUT} />;
}

export const MessageSnackbar: React.FC<MessageSnackbarProps> = ({
  message,
  setMessage,
  messageType = 'error',
}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(message ? true : false);
  const timeoutRef = useRef<number>(0);

  useEffect(() => {
    return () => window.clearTimeout(timeoutRef.current);
  }, []);

  const handleClose = () => {
    window.clearTimeout(timeoutRef.current);
    setOpen(false);
    timeoutRef.current = window.setTimeout(
      () => setMessage(''),
      TRANSITION_TIMEOUT
    );
  };

  useEffect(() => {
    setOpen(message ? true : false);
  }, [message]);

  return (
    <Snackbar
      open={open}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      autoHideDuration={messageType === 'error' ? 60000 : 6000}
      ContentProps={{
        className: messageType === 'error' ? classes.error : classes.success,
      }}
      TransitionComponent={SlideTransition}
      message={
        <div className={classes.message}>
          {messageType === 'error' && (
            <AlertCircleIcon className={classes.icon} />
          )}
          {messageType === 'success' && <CheckIcon className={classes.icon} />}
          {message}
        </div>
      }
      action={[
        <IconButton
          key="close"
          aria-label="close"
          color="inherit"
          onClick={handleClose}
        >
          <CloseIcon />
        </IconButton>,
      ]}
    />
  );
};

const useStyles = makeStyles<Theme>((theme) => ({
  error: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.text.primary,
  },
  success: {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.text.primary,
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    marginRight: theme.spacing(1),
  },
}));
