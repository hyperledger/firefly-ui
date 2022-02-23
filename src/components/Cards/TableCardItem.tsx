import { ListItem, ListItemText, Typography } from '@mui/material';
import { FFColors } from '../../theme';
import { HashPopover } from '../Popovers/HashPopover';

type Props = {
  date: string;
  header: string;
  status: string;
  subText: string;
};

export const TableCardItem: React.FC<Props> = ({
  date,
  header,
  status,
  subText,
}) => {
  return (
    <ListItem
      key={header}
      disableGutters
      sx={{
        borderLeft: 4,
        borderColor: FFColors.Yellow, // TODO: make dynamic based on category
        px: 2,
        height: 50,
        borderTop: 1,
        borderTopColor: 'background.default',
        borderBottom: 1,
        borderBottomColor: 'background.default',
        color: 'text.primary',
        '&:hover': {
          backgroundColor: '#FFF',
          cursor: 'pointer',
          color: 'text.disabled',
        },
      }}
    >
      <ListItemText>
        <Typography
          variant="subtitle1"
          sx={{
            fontSize: '14',
          }}
        >
          {header}
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{
            color: 'text.secondary',
            fontSize: 12,
            textTransform: 'uppercase',
          }}
        >
          {subText}
        </Typography>
      </ListItemText>
      <ListItemText sx={{ justifyContent: 'flex-end', textAlign: 'right' }}>
        <HashPopover address={status ?? ''} shortHash={true}></HashPopover>
        <Typography
          variant="subtitle2"
          sx={{
            color: 'text.secondary',
            fontSize: 12,
            textTransform: 'uppercase',
          }}
        >
          {date}
        </Typography>
      </ListItemText>
    </ListItem>
  );
};
