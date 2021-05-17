import React from 'react';
import { Slide, Modal, Paper, IconButton, makeStyles } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

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
          <Paper square className={classes.paper}>
            <IconButton onClick={onClose} className={classes.close}>
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
    height: '100vh',
    outline: 'none',
    width: '40vw',
    marginLeft: '60vw',
    overflowY: 'auto',
  },
  close: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.text.secondary,
  },
}));
