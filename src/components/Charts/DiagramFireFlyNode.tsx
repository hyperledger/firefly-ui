import { Box, Grid, styled, Typography } from '@mui/material';
import { memo } from 'react';
import { Handle, Position } from 'react-flow-renderer';
import { IStatus } from '../../interfaces';
import { APP_PREFIX, HANDLE_PREFIX, PLUGIN_PREFIX } from './MyNodeDiagram';
import { ReactComponent as LogoSVG } from '../..//svg/ff-logo-symbol-white.svg';
import i18next from 'i18next';

export const FFLogo: React.FC = () => {
  const StyledLogo = styled(LogoSVG)({
    width: 60,
  });
  return (
    <Box
      sx={{
        textAlign: 'center',
      }}
    >
      <StyledLogo />
    </Box>
  );
};

interface FFNodeProps {
  data: {
    applications: IStatus['plugins'];
    plugins: IStatus['plugins'];
    nodeName: string;
  };
}
export const DiagramFireFlyNode = memo((children: FFNodeProps) => {
  if (
    Object.keys(children.data.applications)?.length &&
    Object.keys(children.data.plugins)?.length
  ) {
    return (
      <>
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          height={'100%'}
          width={'100%'}
        >
          <Grid item>
            <Typography>{i18next.t('firefly')}</Typography>
          </Grid>
          <Grid item>
            <Typography>{i18next.t('core')}</Typography>
          </Grid>
          <FFLogo />
          <Grid item>
            <Typography fontSize={'smaller'}>
              {children.data.nodeName}
            </Typography>
          </Grid>
        </Grid>
        {Object.keys(children.data.applications).map((k, idx) => {
          // Only show events on left side
          if (k === 'events') {
            return (
              <Handle
                type="target"
                position={Position.Left}
                id={`${HANDLE_PREFIX}${APP_PREFIX}${idx}`}
                key={`${HANDLE_PREFIX}${APP_PREFIX}${idx}`}
                style={{
                  top: `${
                    5 +
                    (100 / Object.keys(children.data.applications).length) * idx
                  }%`,
                }}
              />
            );
          }
        })}
        {Object.keys(children.data.plugins).map((k, idx) => {
          if (k !== 'events') {
            return (
              <Handle
                type="source"
                position={Position.Right}
                id={`${HANDLE_PREFIX}${PLUGIN_PREFIX}${idx}`}
                key={`${HANDLE_PREFIX}${PLUGIN_PREFIX}${idx}`}
                style={{
                  top: `${
                    5 + (100 / Object.keys(children.data.plugins).length) * idx
                  }%`,
                }}
              />
            );
          }
        })}
      </>
    );
  } else {
    return <></>;
  }
});
