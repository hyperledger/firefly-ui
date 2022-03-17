import ReactJson from 'react-json-view';
import { themeOptions } from '../../theme';

interface Props {
  color?: string;
  json: object;
}

export const FFJsonViewer: React.FC<Props> = ({ color, json }) => {
  const handleCopy = (copy: any) => {
    navigator.clipboard.writeText(JSON.stringify(copy.src, null, '\t'));
  };

  return (
    <ReactJson
      theme={'pop'}
      style={{
        backgroundColor: color ?? themeOptions.palette?.background?.paper,
      }}
      collapseStringsAfterLength={40}
      enableClipboard={handleCopy}
      displayDataTypes={false}
      src={json}
    />
  );
};
