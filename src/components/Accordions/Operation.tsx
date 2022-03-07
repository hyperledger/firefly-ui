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
import { IDataWithHeader } from '../../_core/interfaces';
import { HashPopover } from '../Popovers/HashPopover';

interface Props {
  op: IOperation;
}

export const OperationAccordion: React.FC<Props> = ({ op }) => {
  const { t } = useTranslation();

  const [opExpanded, setOpExpanded] = useState<IOperation>();
  const handleOpChange =
    (op: IOperation) => (event: any, isExpanded: boolean) => {
      setOpExpanded(isExpanded ? op : undefined);
    };

  const opInfo: IDataWithHeader[] = [
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
      expanded={opExpanded?.id === op.id}
      onChange={handleOpChange(op)}
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
              label={op.status}
              sx={{ backgroundColor: OpStatusColorMap[op.status] }}
              size="small"
            ></Chip>
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container item direction="row">
          {opInfo.map((info) => (
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
