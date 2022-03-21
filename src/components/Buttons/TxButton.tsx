import LaunchIcon from '@mui/icons-material/Launch';
import { IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FF_NAV_PATHS } from '../../interfaces';
import { FFColors } from '../../theme';

interface Props {
  ns: string;
  txID: string;
  small?: boolean;
}

export const TxButton: React.FC<Props> = ({ ns, txID, small = false }) => {
  const navigate = useNavigate();
  return (
    <IconButton
      size={small ? 'small' : undefined}
      sx={{ backgroundColor: FFColors.Purple }}
      onClick={() => navigate(FF_NAV_PATHS.activityTxDetailPath(ns, txID))}
    >
      <LaunchIcon />
    </IconButton>
  );
};
