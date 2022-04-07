import LaunchIcon from '@mui/icons-material/Launch';
import { IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FFColors } from '../../theme';

interface Props {
  link: string;
  small?: boolean;
}

export const EventReferenceButton: React.FC<Props> = ({
  link,
  small = false,
}) => {
  const navigate = useNavigate();
  return (
    <IconButton
      size={small ? 'small' : undefined}
      sx={{ backgroundColor: FFColors.Purple }}
      onClick={() => navigate(link)}
    >
      <LaunchIcon />
    </IconButton>
  );
};
