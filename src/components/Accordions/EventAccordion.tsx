import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FF_EVENTS_CATEGORY_MAP,
  IDataWithHeader,
  IEvent,
} from '../../interfaces';
import { DEFAULT_BORDER_RADIUS, themeOptions } from '../../theme';
import { HashPopover } from '../Popovers/HashPopover';

interface Props {
  event: IEvent;
  isOpen?: boolean;
}

export const EventAccordion: React.FC<Props> = ({ event, isOpen = false }) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<boolean>(isOpen);

  const accInfo: IDataWithHeader[] = [
    {
      header: t('id'),
      data: <HashPopover address={event.id} shortHash />,
    },
    {
      header: t('reference'),
      data: <HashPopover address={event.reference} shortHash />,
    },
  ];

  return (
    <Accordion
      key={event.id}
      expanded={expanded}
      onChange={() => setExpanded(!expanded)}
      sx={{
        backgroundColor: themeOptions.palette?.background?.default,
        width: '100%',
        borderRadius: DEFAULT_BORDER_RADIUS,
        minHeight: '60px',
        '&:before': {
          display: 'none',
        },
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Grid container direction="row" alignItems="center">
          {/* Protocol ID */}
          <Grid xs={6} item container justifyContent="flex-start">
            <Typography>
              {t(FF_EVENTS_CATEGORY_MAP[event.type].nicename)}
            </Typography>
          </Grid>
          {/* Time */}
          <Grid xs={6} item container justifyContent="flex-end">
            <Typography>
              {dayjs(event.created).format('MM/DD/YYYY h:mm A')}
            </Typography>
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container item direction="row">
          {accInfo.map((info, idx) => (
            <Grid key={idx} item xs={6} pb={1} justifyContent="flex-start">
              <Typography pb={1} variant="body2">
                {info.header}
              </Typography>
              {info.data}
            </Grid>
          ))}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};
