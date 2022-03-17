import { Grid, Typography } from '@mui/material';
import React from 'react';

interface Props {
  color: string;
  icon?: any;
  text: string | JSX.Element;
}

export const FFTableText: React.FC<Props> = ({ color, icon, text }) => {
  return (
    <Grid container justifyContent="flex-start" alignItems="center">
      {icon}
      <Typography
        sx={{ fontSize: '14px', fontWeight: '500', marginLeft: icon ? 1 : 0 }}
        color={color}
        variant="body1"
      >
        {text}
      </Typography>
    </Grid>
  );
};
