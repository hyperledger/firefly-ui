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
import { ITransaction } from '../../interfaces';
import { FF_TX_CATEGORY_MAP } from '../../interfaces/enums/transactionTypes';
import { themeOptions } from '../../theme';
import { IDataWithHeader } from '../../interfaces';
import { HashPopover } from '../Popovers/HashPopover';

interface Props {
  tx: ITransaction;
}

export const TransactionAccordion: React.FC<Props> = ({ tx }) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<boolean>(false);

  const accInfo: IDataWithHeader[] = [
    {
      header: t('blockchainIds'),
      data: (
        <>
          {tx.blockchainIds.map((id) => (
            <HashPopover key={id} shortHash address={id} />
          ))}
        </>
      ),
    },
    {
      header: t('created'),
      data: (
        <Typography>{dayjs(tx.created).format('MM/DD/YYYY h:mm A')}</Typography>
      ),
    },
  ];

  return (
    <>
      <Accordion
        key={tx.id}
        expanded={expanded}
        onChange={() => setExpanded(!expanded)}
        sx={{
          backgroundColor: themeOptions.palette?.background?.default,
          width: '100%',
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Grid container direction="row" alignItems="center">
            {/* ID */}
            <Grid xs={6} item container justifyContent="flex-start">
              <Typography>{t(FF_TX_CATEGORY_MAP[tx.type].nicename)}</Typography>
            </Grid>
            {/* View data */}
            <Grid xs={6} item container justifyContent="flex-end">
              <HashPopover shortHash address={tx.id} />
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
    </>
  );
};
