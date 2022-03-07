import { ListItem, ListItemText, Typography } from '@mui/material';
import { DEFAULT_PADDING } from '../../theme';
import { HashPopover } from '../Popovers/HashPopover';

type Props = {
  borderColor: string;
  date: string;
  header: string;
  status: string;
  subText: string;
};

export const TableCardItem: React.FC<Props> = ({
  borderColor,
  date,
  header,
  status,
  subText,
}) => {
  return (
    <ListItem
      disableGutters
      sx={{
        borderLeft: 6,
        borderColor: borderColor,
        px: 2,
        height: 60,
        borderTop: 1,
        borderTopColor: 'background.default',
        borderBottom: 1,
        borderBottomColor: 'background.default',
        color: 'text.primary',
        py: DEFAULT_PADDING,
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
