// Copyright © 2022 Kaleido, Inc.
//
// SPDX-License-Identifier: Apache-2.0
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { styled, Tooltip, tooltipClasses, TooltipProps } from '@mui/material';

export const StyledTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
  //TODO: remove any once this is solved in mui https://github.com/mui-org/material-ui/issues/29307
))(({ theme }: any) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    opacity: '0.92 !important',
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.primary.main,
    maxWidth: 420,
    border: `1px solid ${theme.palette.primary.main}`,
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.primary.main,
  },
}));
