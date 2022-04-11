import { Grid, Typography } from '@mui/material';
import { memo } from 'react';
import { Handle, Position } from 'react-flow-renderer';
import { IStatus, IWebsocketConnection } from '../../interfaces';
import { APP_PREFIX, HANDLE_PREFIX, PLUGIN_PREFIX } from './MyNodeDiagram';

interface FFNodeProps {
  data: {
    applications: IWebsocketConnection[];
    plugins: IStatus['plugins'];
    label: string;
    subtitle: string;
  };
}
export const DiagramFireFlyNode = memo((children: FFNodeProps) => {
  if (
    children.data.applications?.length &&
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
            <Typography>{children.data.label}</Typography>
          </Grid>
          <Grid item>
            <Typography fontSize={'smaller'}>
              {children.data.subtitle}
            </Typography>
          </Grid>
        </Grid>
        {children.data.applications.map((_, idx) => {
          return (
            <Handle
              type="target"
              position={Position.Left}
              id={`${HANDLE_PREFIX}${APP_PREFIX}${idx}`}
              key={`${HANDLE_PREFIX}${APP_PREFIX}${idx}`}
              style={{
                top: `${5 + (100 / children.data.applications.length) * idx}%`,
              }}
            />
          );
        })}
        {Object.keys(children.data.plugins).map((_, idx) => {
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
        })}
      </>
    );
  } else {
    return <></>;
  }
});
