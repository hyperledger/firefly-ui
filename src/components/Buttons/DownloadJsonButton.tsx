import { Download } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { downloadJsonString } from '../../utils';

interface Props {
  filename: string;
  jsonString: string;
}

export const DownloadJsonButton: React.FC<Props> = ({
  filename,
  jsonString,
}) => {
  return (
    <IconButton
      onClick={(e) => {
        e.stopPropagation();
        downloadJsonString(jsonString, filename);
      }}
    >
      <Download />
    </IconButton>
  );
};
