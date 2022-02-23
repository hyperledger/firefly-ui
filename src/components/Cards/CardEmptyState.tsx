import { Grid, Typography } from '@mui/material';
import { DEFAULT_PADDING } from '../../theme';

type Props = {
  text: string;
  subText?: string;
};

export const CardEmptyState: React.FC<Props> = ({ text, subText }) => {
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      py={DEFAULT_PADDING}
      sx={{
        minHeight: 150,
      }}
    >
      <Typography variant="subtitle1">{text}</Typography>
      {subText && <Typography variant="subtitle2">{subText}</Typography>}
    </Grid>
  );
};
