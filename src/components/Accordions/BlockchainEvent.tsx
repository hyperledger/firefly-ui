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
import { IBlockchainEvent } from '../../interfaces';
import { themeOptions } from '../../theme';
import { IDataWithHeader } from '../../_core/interfaces';
import { HashPopover } from '../Popovers/HashPopover';

interface Props {
  be: IBlockchainEvent;
}

export const BlockchainEventAccordion: React.FC<Props> = ({ be }) => {
  const { t } = useTranslation();

  const [beExpanded, setBeExpanded] = useState<IBlockchainEvent>();
  const handleBeChange =
    (be: IBlockchainEvent) => (event: any, isExpanded: any) => {
      setBeExpanded(isExpanded ? be : undefined);
    };

  const beInfo: IDataWithHeader[] = [
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
      expanded={beExpanded?.id === be.id}
      onChange={handleBeChange(be)}
      sx={{
        backgroundColor: themeOptions.palette?.background?.default,
        width: '100%',
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
          {beInfo.map((info) => (
            <Grid item xs={6} pb={1} justifyContent="flex-start">
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
