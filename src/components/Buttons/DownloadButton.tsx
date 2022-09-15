import { Download } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { downloadBlobFile, downloadExternalFile } from '../../utils';

interface Props {
  filename?: string;
  isBlob: boolean;
  url: string;
  namespace: string;
}

export const DownloadButton: React.FC<Props> = ({
  filename,
  isBlob,
  url,
  namespace,
}) => {
  return (
    <IconButton
      onClick={(e) => {
        e.stopPropagation();
        isBlob
          ? downloadBlobFile(url, namespace, filename)
          : downloadExternalFile(url, filename);
      }}
    >
      <Download />
    </IconButton>
  );
};
