import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LaunchIcon from '@mui/icons-material/Launch';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  IconButton,
  Link,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IDataWithHeader, IFireflyApi } from '../../interfaces';
import { DEFAULT_BORDER_RADIUS, themeOptions } from '../../theme';
import { FFCopyButton } from '../Buttons/CopyButton';
import { HashPopover } from '../Popovers/HashPopover';

interface Props {
  api: IFireflyApi;
  isOpen?: boolean;
}

export const ApiAccordion: React.FC<Props> = ({ api, isOpen = false }) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<boolean>(isOpen);

  const accInfo: IDataWithHeader[] = [
    {
      header: t('location'),
      data: <HashPopover address={api.location?.address ?? ''} shortHash />,
    },
    {
      header: t('messageID'),
      data: <HashPopover address={api.message} shortHash />,
    },
  ];

  return (
    <Accordion
      key={api.id}
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
          {/* Name */}
          <Grid xs={6} item container justifyContent="flex-start">
            <Typography>{api.name}</Typography>
          </Grid>
          {/* ID */}
          <Grid
            xs={6}
            item
            container
            justifyContent="flex-end"
            alignItems="center"
          >
            <HashPopover shortHash address={api.id} />
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails>
        {/* Basic Data */}
        <Grid container pb={1} item direction="row">
          {accInfo.map((info, idx) => (
            <Grid key={idx} item xs={6} pb={1} justifyContent="flex-start">
              <Typography pb={1} variant="body2">
                {info.header}
              </Typography>
              {info.data}
            </Grid>
          ))}
        </Grid>
        {/* OpenAPI */}
        <Grid container item direction="row">
          <Grid item pb={1} justifyContent="flex-start">
            <Typography variant="body2">{t('openApi')}</Typography>
          </Grid>
          <Grid
            item
            container
            pb={1}
            justifyContent="flex-start"
            alignItems="center"
          >
            <Grid item container xs={10} justifyContent="flex-start">
              <Typography noWrap color="secondary">
                {api.urls.openapi}
              </Typography>
            </Grid>
            <Grid item container xs={2} justifyContent="flex-end">
              <FFCopyButton value={api.urls.openapi}></FFCopyButton>
              <Link target="_blank" href={api.urls.openapi} underline="always">
                <IconButton>
                  <LaunchIcon />
                </IconButton>
              </Link>
            </Grid>
          </Grid>
        </Grid>
        {/* Swagger */}
        <Grid container item direction="row">
          <Grid item pb={1} justifyContent="flex-start">
            <Typography variant="body2">{t('swagger')}</Typography>
          </Grid>
          <Grid
            item
            container
            pb={1}
            justifyContent="flex-start"
            alignItems="center"
          >
            <Grid item container xs={10} justifyContent="flex-start">
              <Typography noWrap color="secondary">
                {api.urls.ui}
              </Typography>
            </Grid>
            <Grid item container xs={2} justifyContent="flex-end">
              <FFCopyButton value={api.urls.ui}></FFCopyButton>
              <Link target="_blank" href={api.urls.ui} underline="always">
                <IconButton>
                  <LaunchIcon />
                </IconButton>
              </Link>
            </Grid>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};
