import LaunchIcon from '@mui/icons-material/Launch';
import { IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FF_NAV_PATHS } from '../../interfaces';
import { FFColors } from '../../theme';

interface Props {
  ns: string;
  msgID: string;
  small?: boolean;
}

export const MsgButton: React.FC<Props> = ({ ns, msgID, small = false }) => {
  const navigate = useNavigate();
  return (
    <IconButton
      size={small ? 'small' : undefined}
      sx={{ backgroundColor: FFColors.Purple }}
      onClick={() => navigate(FF_NAV_PATHS.offchainMessagesPath(ns, msgID))}
    >
      <LaunchIcon />
    </IconButton>
  );
};
