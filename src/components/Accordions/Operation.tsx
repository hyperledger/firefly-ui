import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Chip,
  Grid,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IOperation } from '../../interfaces';
import { FF_OP_CATEGORY_MAP, OpStatusColorMap } from '../../interfaces/enums';
import { themeOptions } from '../../theme';
import { IDataWithHeader } from '../../interfaces';
import { HashPopover } from '../Popovers/HashPopover';

interface Props {
  op: IOperation;
}

export const OperationAccordion: React.FC<Props> = ({ op }) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<boolean>(false);

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
        <Typography variant="body2">
          {dayjs(op.updated).format('MM/DD/YYYY h:mm A')}
        </Typography>
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
        <Grid container item direction="row">
          {accInfo.map((info) => (
            <Grid item xs={4} pb={1} justifyContent="flex-start">
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
