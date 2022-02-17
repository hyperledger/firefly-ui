import { ListItem, ListItemText, Typography } from '@mui/material';
import { FFColors } from '../../theme';
import { getShortHash } from '../../utils';
import { ITableCardItem } from './CardInterfaces';

type Props = {
  item: ITableCardItem;
};

export const TableCardItem: React.FC<Props> = ({ item }) => {
  return (
    <ListItem
      key={item.header}
      disableGutters
      sx={{
        borderLeft: 4,
        borderColor: FFColors.Yellow, // TODO: make dynamic,
        px: 2,
        height: 50,
        borderTop: 1,
        borderTopColor: 'background.default',
        borderBottom: 1,
        borderBottomColor: 'background.default',
        '&:hover': {
          cursor: 'pointer',
        },
      }}
    >
      <ListItemText>
        <Typography
          variant="subtitle1"
          sx={{
            fontSize: '14',
            color: 'text.primary',
          }}
        >
          {item.header}
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{
            color: 'text.secondary',
            fontSize: 12,
            textTransform: 'uppercase',
          }}
        >
          {item.subText}
        </Typography>
      </ListItemText>
      <ListItemText sx={{ justifyContent: 'flex-end', textAlign: 'right' }}>
        <Typography variant="subtitle1" sx={{ fontSize: 14 }}>
          {getShortHash(item.status).length
            ? getShortHash(item.status)
            : item.status}
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{
            color: 'text.secondary',
            fontSize: 12,
            textTransform: 'uppercase',
          }}
        >
          {item.date}
        </Typography>
      </ListItemText>
    </ListItem>
  );
};
