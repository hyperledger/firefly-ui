import ApprovalIcon from '@mui/icons-material/Approval';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { TransferKeyEnum } from '.';

export const TransferIconMap = {
  [TransferKeyEnum.BURN.toLowerCase()]: <LocalFireDepartmentIcon />,
  [TransferKeyEnum.MINT.toLowerCase()]: <ApprovalIcon />,
  [TransferKeyEnum.TRANSFER.toLowerCase()]: <SwapHorizIcon />,
};
