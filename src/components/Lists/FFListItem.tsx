import { Grid, Typography } from '@mui/material';
import { IDataListItem } from '../../interfaces/lists';

interface Props {
  item: IDataListItem;
}

export const FFListItem: React.FC<Props> = ({ item }) => {
  return (
    <Grid
      xs={12}
      py={1}
      sx={{
        minHeight: '60px',
      }}
      container
      item
      alignItems="center"
    >
      <Grid item xs={2}>
        <Typography color="secondary" sx={{ fontSize: 12 }}>
          {item.label}
        </Typography>
      </Grid>
      <Grid
        item
        xs={8}
        color="primary"
        sx={{ fontSize: 12, fontWeight: 'bold' }}
      >
        {item.value}
      </Grid>
      <Grid justifyContent="flex-end" container item xs={2}>
        {item.button}
      </Grid>
    </Grid>
  );
};