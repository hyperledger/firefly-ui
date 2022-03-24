import { Typography } from '@mui/material';

interface Props {
  color: string;
  padding?: boolean;
  text: string;
  isHeader?: boolean;
}

export const FFAccordionText: React.FC<Props> = ({
  color,
  padding = false,
  text,
  isHeader = false,
}) => {
  return (
    <Typography
      sx={{
        fontSize: isHeader ? '16px' : '14px',
        fontWeight: isHeader ? '600' : '500',
        paddingBottom: padding ? 1 : 0,
      }}
      color={color}
      variant="body2"
      noWrap
    >
      {text}
    </Typography>
  );
};
