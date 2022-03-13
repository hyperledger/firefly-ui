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
import { IContractListener } from '../../interfaces';
import { themeOptions } from '../../theme';
import { IDataWithHeader } from '../../_core/interfaces';
import { HashPopover } from '../Popovers/HashPopover';

interface Props {
  listener: IContractListener;
}

export const ListenerAccordion: React.FC<Props> = ({ listener }) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<boolean>(false);

  const accIfno: IDataWithHeader[] = [
    {
      header: t('listenerID'),
      data: <HashPopover address={listener.id} shortHash />,
    },
    {
      header: t('protocolID'),
      data: <HashPopover address={listener.protocolId} shortHash />,
    },
    {
      header: t('location'),
      data: <HashPopover address={listener.location.address} shortHash />,
    },
  ];

  return (
    <Accordion
      key={listener.id}
      expanded={expanded}
      onChange={() => setExpanded(!expanded)}
      sx={{
        backgroundColor: themeOptions.palette?.background?.default,
        width: '100%',
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Grid container direction="row" alignItems="center">
          {/* Event Name */}
          <Grid xs={6} item container justifyContent="flex-start">
            <Typography>{listener.event.name}</Typography>
          </Grid>
          {/* Created */}
          <Grid xs={6} item container justifyContent="flex-end">
            <Typography>
              {dayjs(listener.created).format('MM/DD/YYYY h:mm A')}
            </Typography>
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails>
        {/* Basic Data */}
        <Grid container item direction="row">
          {accIfno.map((info) => (
            <Grid
              key={info.header}
              item
              xs={4}
              pb={1}
              justifyContent="flex-start"
            >
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
