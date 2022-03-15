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
import { IBlockchainEvent, IDataWithHeader } from '../../interfaces';
import { DEFAULT_BORDER_RADIUS, themeOptions } from '../../theme';
import { HashPopover } from '../Popovers/HashPopover';

interface Props {
  be: IBlockchainEvent;
  isOpen?: boolean;
}

export const BlockchainEventAccordion: React.FC<Props> = ({
  be,
  isOpen = false,
}) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<boolean>(isOpen);

  const accInfo: IDataWithHeader[] = [
    {
      header: t('id'),
      data: <HashPopover address={be.id} shortHash />,
    },
    {
      header: t('source'),
      data: <Typography variant="body2">{be.source}</Typography>,
    },
  ];

  return (
    <Accordion
      key={be.id}
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
            <Typography>{be.protocolId}</Typography>
          </Grid>
          {/* Time */}
          <Grid xs={6} item container justifyContent="flex-end">
            <Typography>
              {dayjs(be.timestamp).format('MM/DD/YYYY h:mm A')}
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