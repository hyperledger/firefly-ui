import { Grid, Tooltip, Typography } from '@mui/material';
import React from 'react';

interface Props {
  color: string;
  icon?: any;
  text: string | JSX.Element;
  isComponent?: boolean;
  tooltip?: string;
}

export const FFTableText: React.FC<Props> = ({
  color,
  icon,
  isComponent = false,
  text,
  tooltip,
}) => {
  return (
    <Grid container justifyContent="flex-start" alignItems="center">
      {icon}
      {isComponent ? (
        <Grid item>{text}</Grid>
      ) : tooltip ? (
        <Tooltip title={tooltip} placement="top">
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: '500',
              marginLeft: icon ? 1 : 0,
            }}
            color={color}
            variant="body1"
          >
            {text}
          </Typography>
        </Tooltip>
      ) : (
        <Typography
          sx={{
            fontSize: '14px',
            fontWeight: '500',
            marginLeft: icon ? 1 : 0,
          }}
          color={color}
          variant="body1"
        >
          {text}
        </Typography>
      )}
    </Grid>
  );
};
