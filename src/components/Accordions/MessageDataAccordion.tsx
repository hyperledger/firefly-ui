import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LaunchIcon from '@mui/icons-material/Launch';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  IconButton,
  Modal,
  Paper,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import { FF_NAV_PATHS, IData, IDataWithHeader } from '../../interfaces';
import {
  DEFAULT_BORDER_RADIUS,
  DEFAULT_PADDING,
  themeOptions,
} from '../../theme';
import { FFCopyButton } from '../Buttons/CopyButton';
import { HashPopover } from '../Popovers/HashPopover';

interface Props {
  data: IData;
  isOpen?: boolean;
}

export const MessageDataAccordion: React.FC<Props> = ({
  data,
  isOpen = false,
}) => {
  const { selectedNamespace } = useContext(ApplicationContext);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<boolean>(isOpen);
  const [openDataModal, setOpenDataModal] = useState(false);

  const accInfo: IDataWithHeader[] = [
    {
      header: t('id'),
      data: <HashPopover address={data.id} shortHash />,
    },
    {
      header: t('validator'),
      data: <Typography variant="body2">{data.validator}</Typography>,
    },
    {
      header: t('hash'),
      data: <HashPopover address={data.hash} shortHash />,
    },
    {
      header: t('created'),
      data: (
        <Typography variant="body2">
          {dayjs(data.created).format('MM/DD/YYYY h:mm A')}
        </Typography>
      ),
    },
  ];

  return (
    <>
      <Accordion
        key={data.id}
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
            {/* ID */}
            <Grid xs={6} item container justifyContent="flex-start">
              <Typography>{data.id}</Typography>
            </Grid>
            {/* View data */}
            <Grid xs={6} item container justifyContent="flex-end">
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenDataModal(true);
                }}
              >
                <VisibilityIcon />
              </IconButton>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(
                    FF_NAV_PATHS.offchainDataPath(selectedNamespace, data.id)
                  );
                }}
              >
                <LaunchIcon />
              </IconButton>
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container item direction="row">
            {accInfo.map((info, idx) => (
              <Grid key={idx} item xs={3} pb={1} justifyContent="flex-start">
                <Typography pb={1} variant="body2">
                  {info.header}
                </Typography>
                {info.data}
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>
      <Modal
        open={openDataModal}
        onClose={() => setOpenDataModal(false)}
        sx={{ wordWrap: 'break-word' }}
      >
        <Paper sx={modalStyle}>
          <pre>{JSON.stringify(data.value, null, 2)}</pre>
          <Grid pt={DEFAULT_PADDING} container justifyContent="center">
            <FFCopyButton
              longForm
              value={JSON.stringify(data.value, null, 2)}
            />
          </Grid>
        </Paper>
      </Modal>
    </>
  );
};

const modalStyle = {
  position: 'absolute' as const,
  overflow: 'auto',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '40%',
  height: '50%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  wordWrap: 'break-word',
};
