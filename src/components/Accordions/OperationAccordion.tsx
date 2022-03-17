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
import { IDataWithHeader, IOperation } from '../../interfaces';
import { FF_OP_CATEGORY_MAP, OpStatusColorMap } from '../../interfaces/enums';
import { DEFAULT_BORDER_RADIUS, themeOptions } from '../../theme';
import { getFFTime } from '../../utils';
import { HashPopover } from '../Popovers/HashPopover';

interface Props {
  op: IOperation;
  isOpen?: boolean;
}

export const OperationAccordion: React.FC<Props> = ({ op, isOpen = false }) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<boolean>(isOpen);

  const accInfo: IDataWithHeader[] = [
    {
      header: t('id'),
      data: <HashPopover address={op.id} shortHash />,
    },
    {
      header: t('plugin'),
      data: <Typography variant="body2">{op.plugin}</Typography>,
    },
    {
      header: t('updated'),
      data: (
        <Typography variant="body2">{getFFTime(op.updated, true)}</Typography>
      ),
    },
  ];

  return (
    <Accordion
      key={op.id}
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
            <Typography>{t(FF_OP_CATEGORY_MAP[op.type].nicename)}</Typography>
          </Grid>
          {/* Status */}
          <Grid xs={6} item container justifyContent="flex-end">
            <Chip
              label={op.status?.toLocaleUpperCase()}
              sx={{ backgroundColor: OpStatusColorMap[op.status] }}
            ></Chip>
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container direction="row">
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
  );
};
