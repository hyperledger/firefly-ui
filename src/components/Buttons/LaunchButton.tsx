import { Launch } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FFColors } from '../../theme';

interface Props {
  link: string;
  noColor?: boolean;
}

export const LaunchButton: React.FC<Props> = ({ link, noColor = false }) => {
  const navigate = useNavigate();

  return (
    <IconButton
      sx={{ backgroundColor: noColor ? undefined : FFColors.Purple }}
      onClick={() => navigate(link)}
    >
      <Launch />
    </IconButton>
  );
};
