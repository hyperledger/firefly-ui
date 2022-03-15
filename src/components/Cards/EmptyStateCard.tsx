import { Grid, Typography } from '@mui/material';
import { DEFAULT_PADDING } from '../../theme';

type Props = {
  height?: number;
  text: string;
  subText?: string;
};

export const EmptyStateCard: React.FC<Props> = ({ text, subText, height }) => {
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
      <Typography variant="subtitle1">{text}</Typography>
      {subText && <Typography variant="subtitle2">{subText}</Typography>}
    </Grid>
  );
};
