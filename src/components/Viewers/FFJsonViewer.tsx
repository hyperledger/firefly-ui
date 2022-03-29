import { useTheme } from '@mui/material';
import ReactJson from 'react-json-view';

interface Props {
  json: object;
}

export const FFJsonViewer: React.FC<Props> = ({ json }) => {
  const theme = useTheme();
  const handleCopy = (copy: any) => {
    navigator.clipboard.writeText(JSON.stringify(copy.src, null, '\t'));
  };

  return (
    <ReactJson
      theme={'pop'}
      style={{
        backgroundColor: theme.palette.background.paper,
        fontSize: '12px',
      }}
      collapseStringsAfterLength={40}
      enableClipboard={handleCopy}
      displayDataTypes={false}
      src={json}
    />
  );
};
