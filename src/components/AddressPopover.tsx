import React, { useState, useRef } from 'react';
import { Chip, Grid, Popover, IconButton, makeStyles } from '@material-ui/core';
import ContentCopyIcon from 'mdi-react/ContentCopyIcon';
import CopyToClipboard from 'react-copy-to-clipboard';

interface Props {
  address: string;
}

export const AddressPopover: React.FC<Props> = ({ address }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <Chip
        label={address}
        className={classes.chip}
        onClick={(event) => {
          event.stopPropagation();
          setOpen(!open);
        }}
        ref={anchorRef}
      />
      <Popover
        open={open}
        anchorEl={anchorRef.current}
        onClose={() => setOpen(false)}
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
          <Grid item>{address}</Grid>
          <Grid item>
            <CopyToClipboard text={address}>
              <IconButton className={classes.button}>
                <ContentCopyIcon />
              </IconButton>
            </CopyToClipboard>
          </Grid>
        </Grid>
      </Popover>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  chip: {
    width: 100,
    borderRadius: 2,
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.secondary,
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
}));
