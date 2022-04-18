import { Grid } from '@mui/material';
import { SkeletonCard } from '../Cards/EventCards/SkeletonCard';

interface Props {
  numElements: number;
}

export const SkeletonCardList: React.FC<Props> = ({ numElements }) => {
  return (
    <>
      {Array.from(Array(numElements)).map((_, idx) => (
        <Grid
          item
          container
          alignItems="flex-start"
          justifyContent="flex-start"
          key={idx}
        >
          <SkeletonCard />
          <Grid sx={{ padding: '1px' }} />
        </Grid>
      ))}
    </>
  );
};
