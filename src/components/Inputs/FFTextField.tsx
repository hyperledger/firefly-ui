import { InputAdornment, TextField } from '@mui/material';
import { FFCopyButton } from '../Buttons/CopyButton';

type Props = {
  defaultValue: string;
  label: string;
  hasCopyBtn?: boolean;
};

export const FFTextField: React.FC<Props> = ({
  defaultValue,
  label,
  hasCopyBtn,
}) => {
  return (
    <TextField
      label={label}
      defaultValue={defaultValue}
      variant="outlined"
      multiline
      maxRows={4}
      InputProps={{
        readOnly: true,
        endAdornment: hasCopyBtn && (
          <InputAdornment position="end">
            <FFCopyButton value={defaultValue} />
          </InputAdornment>
        ),
      }}
      fullWidth
    />
  );
};
