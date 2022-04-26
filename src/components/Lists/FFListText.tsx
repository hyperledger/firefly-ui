import { Typography } from '@mui/material';

interface Props {
  color: string;
  text: string;
  tooltip?: string;
}

export const FFListText: React.FC<Props> = ({ color, text, tooltip }) => {
  return tooltip ? (
    <>
      <Typography
        noWrap
        sx={{ fontSize: '14px', fontWeight: '500' }}
        color={color}
        variant="body2"
        component={'span'}
      >
        {text}
      </Typography>
      <Typography
        noWrap
        sx={{ fontSize: '14px', fontWeight: '500' }}
        color="secondary"
        variant="body2"
        component={'span'}
      >
        {' '}
        ({tooltip})
      </Typography>
    </>
  ) : (
    <Typography
      noWrap
      sx={{ fontSize: '14px', fontWeight: '500' }}
      color={color}
      variant="body2"
    >
      {text}
    </Typography>
  );
};
