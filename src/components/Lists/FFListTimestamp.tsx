import { Grid, Typography } from '@mui/material';
import { getFFTime } from '../../utils';

interface Props {
  ts: string;
}

export const FFListTimestamp: React.FC<Props> = ({ ts }) => {
  return (
    <Grid container item direction="row" alignItems="center">
      <Typography variant="body2">{getFFTime(ts, true)}</Typography>
      <Typography color="secondary" variant="body2">
        &nbsp;({getFFTime(ts)})
      </Typography>
    </Grid>
  );
};
