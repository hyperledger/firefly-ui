import { useTheme } from '@mui/material';
import ReactJson from 'react-json-view';
import { FFTextField } from '../Inputs/FFTextField';

interface Props {
  json: object | string;
}

const isValidJson = (obj: object) => {
  const str = JSON.stringify(obj);
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

export const FFJsonViewer: React.FC<Props> = ({ json }) => {
  const theme = useTheme();
  const handleCopy = (copy: any) => {
    navigator.clipboard.writeText(JSON.stringify(copy.src, null, '\t'));
  };

  return typeof json === 'object' && isValidJson(json) ? (
    <ReactJson
      theme={'pop'}
      style={{
        backgroundColor: theme.palette.background.paper,
        fontSize: '14px',
      }}
      collapseStringsAfterLength={50}
      enableClipboard={handleCopy}
      displayDataTypes={false}
      displayObjectSize={false}
      src={json}
      name={false}
    />
  ) : (
    <FFTextField hasCopyBtn defaultValue={json as string} label={''} />
  );
};
