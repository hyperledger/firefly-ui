import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Button, Grid, IconButton, Typography } from '@mui/material';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useTranslation } from 'react-i18next';

type Props = {
  value: string;
  longForm?: boolean;
};

export const FFCopyButton: React.FC<Props> = ({ value, longForm }) => {
  const { t } = useTranslation();

  return (
    <CopyToClipboard text={value}>
      {longForm ? (
        <Button startIcon={<ContentCopyIcon />} size="small" variant="outlined">
          <Typography variant="body2">{t('copyToClipboard')}</Typography>
        </Button>
      ) : (
        <IconButton>
          <ContentCopyIcon />
        </IconButton>
      )}
    </CopyToClipboard>
  );
};
