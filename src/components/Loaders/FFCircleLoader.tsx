import { CircularProgress, Grid } from '@mui/material';
import { DEFAULT_PADDING } from '../../theme';

type Props = {
  color:
    | 'primary'
    | 'secondary'
    | 'error'
    | 'info'
    | 'success'
    | 'warning'
    | 'inherit'
    | undefined;
  height?: number;
};

export const FFCircleLoader: React.FC<Props> = ({ color, height }) => {
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      py={DEFAULT_PADDING}
      sx={{
        height,
        minHeight: 150,
      }}
    >
      <CircularProgress color={color} />
    </Grid>
  );
};
