import { Grid, Typography } from '@mui/material';

export interface IDataListItem {
  label: string;
  value: string | JSX.Element | number | undefined;
  button?: JSX.Element | undefined;
}

interface Props {
  item: IDataListItem;
}

export const DrawerListItem: React.FC<Props> = ({ item }) => {
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
