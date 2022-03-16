import LaunchIcon from '@mui/icons-material/Launch';
import { IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FF_NAV_PATHS } from '../../interfaces';
import { FFColors } from '../../theme';

interface Props {
  ns: string;
  poolID: string;
}

export const PoolButton: React.FC<Props> = ({ ns, poolID }) => {
  const navigate = useNavigate();
  return (
    <IconButton
      sx={{ backgroundColor: FFColors.Purple }}
      onClick={() => navigate(FF_NAV_PATHS.tokensPoolDetailsPath(ns, poolID))}
    >
      <LaunchIcon />
    </IconButton>
  );
};
