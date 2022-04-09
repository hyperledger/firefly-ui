import { Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { BarDatum } from '@nivo/bar';
import dagre from 'dagre';
import React, { memo } from 'react';
import ReactFlow, {
  Edge,
  Handle,
  MarkerType,
  Node,
  Position,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from 'react-flow-renderer';
import { DEFAULT_BORDER_RADIUS, FFColors } from '../../theme';
import { FFCircleLoader } from '../Loaders/FFCircleLoader';

interface Props {
  data: BarDatum[] | undefined;
  isLoading: boolean;
}

const HANDLE_PREFIX = 'handle_';
const APP_PREFIX = 'app_';
const FF_NODE_PREFIX = 'firefly_';
const PLUGIN_PREFIX = 'plugin_';
const position = { x: 0, y: 0 };

const nodeStyle = {
  border: `5px solid ${FFColors.Yellow}`,
  borderRadius: DEFAULT_BORDER_RADIUS,
  color: FFColors.Yellow,
  background: 'transparent',
};

const edgeStyle = {
  stroke: FFColors.Orange,
  strokeWidth: '3',
};

export const FireflyNode = memo(() => {
  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        height={'100%'}
      >
        <Grid item>
          <Typography>FireFly</Typography>
        </Grid>
      </Grid>
      {apps.map((_, idx) => {
        return (
          <Handle
            type="target"
            position={Position.Left}
            id={`${HANDLE_PREFIX}${APP_PREFIX}${idx}`}
            key={`${HANDLE_PREFIX}${APP_PREFIX}${idx}`}
            style={{
              top: `${5 + (100 / apps.length) * idx}%`,
            }}
          />
        );
      })}
      {plugins.map((_, idx) => {
        return (
          <Handle
            type="source"
            position={Position.Right}
            id={`${HANDLE_PREFIX}${PLUGIN_PREFIX}${idx}`}
            key={`${HANDLE_PREFIX}${PLUGIN_PREFIX}${idx}`}
            style={{
              top: `${5 + (100 / apps.length) * idx}%`,
            }}
          />
        );
      })}
      {/* </Grid> */}
    </>
  );
});

const nodeTypes = {
  fireflyNode: FireflyNode,
};

const apps = [
  {
    name: 'app_1',
  },
  {
    name: 'app_2',
  },
  {
    name: 'app_3',
  },
];

const plugins = [
  {
    name: 'plugin_1',
  },
  {
    name: 'plugin_2',
  },
  {
    name: 'plugin_3',
  },
];

const makeAppNodes = (): Node[] => {
  return apps.map((a, idx) => {
    return {
      id: `${APP_PREFIX}${idx}`,
      sourcePosition: Position.Right,
      type: 'input',
      style: nodeStyle,
      data: { label: a.name },
      position,
    };
  });
};

const makeFireFlyNode = (): Node => {
  return {
    type: 'fireflyNode',
    id: FF_NODE_PREFIX,
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    style: { ...nodeStyle, width: 100, height: 200 },
    data: { label: 'FireFly' },
    width: 100,
    height: 200,
    position,
  };
};

const makePluginNodes = (): Node[] => {
  return plugins.map((p, idx) => {
    return {
      id: `${PLUGIN_PREFIX}${idx}`,
      targetPosition: Position.Left,
      type: 'output',
      data: { label: p.name },
      position,
      style: nodeStyle,
    };
  });
};

const makeNodes = (): Node[] => {
  let nodes: Node[] = [];

  nodes = nodes.concat(makeAppNodes());
  nodes.push(makeFireFlyNode());
  nodes = nodes.concat(makePluginNodes());

  return nodes;
};

const makeEdges = (): Edge[] => {
  let edges: Edge[] = [];

  // Apps
  edges = edges.concat(
    apps.map((_, idx): Edge => {
      return {
        id: `${APP_PREFIX}${FF_NODE_PREFIX}${idx}`,
        source: `${APP_PREFIX}${idx}`,
        targetHandle: `${HANDLE_PREFIX}${APP_PREFIX}${idx}`,
        target: FF_NODE_PREFIX,
        style: edgeStyle,
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
      };
    })
  );

  // Plugins
  edges = edges.concat(
    plugins.map((_, idx): Edge => {
      return {
        id: `${PLUGIN_PREFIX}${FF_NODE_PREFIX}${idx}`,
        source: FF_NODE_PREFIX,
        sourceHandle: `${HANDLE_PREFIX}${PLUGIN_PREFIX}${idx}`,
        target: `${PLUGIN_PREFIX}${idx}`,
        style: edgeStyle,
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
      };
    })
  );

  return edges;
};

const nodeWidth = 150;
const nodeHeight = 40;

const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: 'LR' });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });
  dagre.layout(dagreGraph);

  nodes.forEach((node: Node) => {
    const nodeWithPosition = dagreGraph.node(node.id);

    node.targetPosition = Position.Left;
    node.sourcePosition = Position.Right;

    if (node.id !== FF_NODE_PREFIX) {
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      node.position = {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      };
    } else {
      node.position = {
        x: 200,
        y: 10,
      };
    }

    return node;
  });

  return { nodes, edges };
};

const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
  makeNodes(),
  makeEdges()
);

// TODO: use API data
export const Diagram: React.FC<Props> = ({ data, isLoading }) => {
  const [nodes, , onNodesChange] = useNodesState(layoutedNodes);
  const [edges, , onEdgesChange] = useEdgesState(layoutedEdges);

  return (
    <Box
      id="ffChart"
      borderRadius={DEFAULT_BORDER_RADIUS}
      sx={{
        width: '100%',
        height: `100%`,
      }}
    >
      {!data || isLoading ? (
        <FFCircleLoader height="100%" color="warning"></FFCircleLoader>
      ) : (
        <Grid height="100%" width="100%" sx={{ cursor: 'pointer' }}>
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              fitView
              nodeTypes={nodeTypes}
              defaultMarkerColor={FFColors.Orange}
            ></ReactFlow>
          </ReactFlowProvider>
        </Grid>
      )}
    </Box>
  );
};
