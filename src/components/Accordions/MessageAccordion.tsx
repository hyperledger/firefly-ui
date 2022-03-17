import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Chip,
  Grid,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FF_MESSAGES_CATEGORY_MAP,
  IDataWithHeader,
  IMessage,
  MsgStateColorMap,
} from '../../interfaces';
import { DEFAULT_BORDER_RADIUS, themeOptions } from '../../theme';
import { getFFTime } from '../../utils';
import { HashPopover } from '../Popovers/HashPopover';

interface Props {
  isOpen?: boolean;
  message: IMessage;
}

export const MessageAccordion: React.FC<Props> = ({
  message,
  isOpen = false,
}) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<boolean>(isOpen);

  const accInfo: IDataWithHeader[] = [
    {
      header: t('id'),
      data: <HashPopover address={message.header.id} shortHash />,
    },
    {
      header: t('author'),
      data: <HashPopover address={message.header.author} shortHash />,
    },
    {
      header: t('created'),
      data: (
        <Typography variant="body2">
          {getFFTime(message.header.created, true)}
        </Typography>
      ),
    },
  ];

  return (
    <>
      <Accordion
        key={message.header.id}
        expanded={expanded}
        onChange={() => setExpanded(!expanded)}
        sx={{
          backgroundColor: themeOptions.palette?.background?.default,
          width: '100%',
          borderRadius: DEFAULT_BORDER_RADIUS,
          '&:before': {
            display: 'none',
          },
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Grid container direction="row" alignItems="center">
            {/* Type */}
            <Grid xs={6} item container justifyContent="flex-start">
              <Typography>
                {t(FF_MESSAGES_CATEGORY_MAP[message.header.type].nicename)}
              </Typography>
            </Grid>
            {/* State */}
            <Grid xs={6} item container justifyContent="flex-end">
              {message.state && (
                <Chip
                  label={message.state?.toLocaleUpperCase()}
                  sx={{ backgroundColor: MsgStateColorMap[message.state] }}
                ></Chip>
              )}
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container item direction="row">
            {accInfo.map((info, idx) => (
              <Grid key={idx} item xs={4} pb={1} justifyContent="flex-start">
                <Typography pb={1} variant="body2">
                  {info.header}
                </Typography>
                {info.data}
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>
    </>
  );
};
