import LaunchIcon from '@mui/icons-material/Launch';
import { IconButton } from '@mui/material';
import { useContext } from 'react';
import { SlideContext } from '../../contexts/SlideContext';
import { FFColors } from '../../theme';

interface Props {
  retryOpID: string;
}

export const OpRetryButton: React.FC<Props> = ({ retryOpID }) => {
  const { setSlideSearchParam } = useContext(SlideContext);

  return (
    <IconButton
      sx={{ backgroundColor: FFColors.Purple }}
      onClick={() => setSlideSearchParam(retryOpID)}
    >
      <LaunchIcon />
    </IconButton>
  );
};
