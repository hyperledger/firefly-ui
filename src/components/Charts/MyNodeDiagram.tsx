import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import dagre from 'dagre';
import i18next from 'i18next';
import React, { useContext, useEffect, useState } from 'react';
import ReactFlow, {
  Edge,
  MarkerType,
  Node,
  NodeTypes,
  Position,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from 'react-flow-renderer';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import { IStatus, IWebsocketConnection } from '../../interfaces';
import { DEFAULT_BORDER_RADIUS, FFColors } from '../../theme';
import { getShortHash } from '../../utils';
import { FFCircleLoader } from '../Loaders/FFCircleLoader';
import { DiagramFireFlyNode } from './DiagramFireFlyNode';

export const HANDLE_PREFIX = 'handle_';
export const APP_PREFIX = 'app_';
export const FF_NODE_PREFIX = 'firefly_';
export const PLUGIN_PREFIX = 'plugin_';
export const position = { x: 0, y: 0 };

const FF_WIDTH = 100;
const FF_HEIGHT = 400;

const nodeStyle = {
  border: `3px solid ${FFColors.Yellow}`,
  borderRadius: DEFAULT_BORDER_RADIUS,
  color: '#FFF',
  background: 'transparent',
  fontSize: '14px',
};

const edgeStyle = {
  color: FFColors.Orange,
  stroke: FFColors.Orange,
  strokeWidth: '3',
};

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 350;
const nodeHeight = 25;

const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
  dagreGraph.setGraph({ rankdir: 'LR' });

  nodes.forEach((node) => {
    if (node.id !== FF_NODE_PREFIX) {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    } else {
      dagreGraph.setNode(node.id, { width: FF_WIDTH, height: FF_HEIGHT });
    }
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = Position.Left;
    node.sourcePosition = Position.Right;

    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y:
        nodeWithPosition.y -
        (node.id !== FF_NODE_PREFIX ? nodeHeight : FF_HEIGHT) / 2,
    };

    return node;
  });

  return { nodes, edges };
};

const makeInitialNodes = (
  applications: any[],
  plugins: IStatus['plugins'],
  nodeName: string
) => {
  let nodes: Node[] = [];
  // Applications (Left side)
  nodes = nodes.concat(
    applications.map((a, idx) => {
      return {
        id: `${APP_PREFIX}${idx}`,
        sourcePosition: Position.Right,
        type: 'input',
        style: nodeStyle,
        data: { label: getShortHash(a.id) },
        position,
      };
    })
  );
  // Firefly
  nodes.push({
    type: 'fireflyNode',
    id: FF_NODE_PREFIX,
    targetPosition: Position.Left,
    sourcePosition: Position.Right,
    style: { ...nodeStyle, height: FF_HEIGHT, width: FF_WIDTH },
    data: {
      applications,
      plugins,
      label: i18next.t('firefly'),
      subtitle: nodeName,
    },
    position,
  });
  // Plugins (Right side)
  Object.entries(plugins).map(([k, v]) => {
    nodes = nodes.concat(
      v.map((plugin, idx) => {
        return {
          id: `${PLUGIN_PREFIX}${k}_${idx}`,
          targetPosition: Position.Left,
          type: 'output',
          data: { label: plugin.connection },
          position,
          style: nodeStyle,
        };
      })
    );
  });

  return nodes;
};

const makeInitialEdges = (
  applications: IWebsocketConnection[],
  plugins: IStatus['plugins']
) => {
  let edges: Edge[] = [];

  // Apps
  edges = edges.concat(
    applications.map((_, idx): Edge => {
      return {
        id: `${APP_PREFIX}${FF_NODE_PREFIX}${idx}`,
        source: `${APP_PREFIX}${idx}`,
        targetHandle: `${HANDLE_PREFIX}${APP_PREFIX}${idx}`,
        target: FF_NODE_PREFIX,
        style: edgeStyle,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: FFColors.Orange,
        },
        label: i18next.t('websocket'),
        labelBgPadding: [8, 4],
        labelBgBorderRadius: 4,
        labelBgStyle: {
          fill: '#1e242a',
          fillOpacity: 0.97,
        },
        labelStyle: { fill: '#FFFFFF', fontWeight: 700 },
      };
    })
  );
  // Plugins
  Object.entries(plugins).map(([k, v], pIdx) => {
    edges = edges.concat(
      v.map((_, idx) => {
        return {
          id: `${PLUGIN_PREFIX}${FF_NODE_PREFIX}${k}_${idx}`,
          source: FF_NODE_PREFIX,
          sourceHandle: `${HANDLE_PREFIX}${PLUGIN_PREFIX}${pIdx}`,
          target: `${PLUGIN_PREFIX}${k}_${idx}`,
          style: edgeStyle,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: FFColors.Orange,
          },
          label: i18next.t(k),
          labelBgPadding: [8, 4],
          labelBgBorderRadius: 4,
          labelBgStyle: {
            fill: '#1e242a',
            fillOpacity: 0.97,
          },
          labelStyle: { fill: '#FFFFFF', fontWeight: 700 },
        };
      })
    );
  });

  return edges;
};

const nodeTypes: NodeTypes = {
  fireflyNode: DiagramFireFlyNode,
};

interface Props {
  applications: IWebsocketConnection[];
  plugins: IStatus['plugins'];
}

export const MyNodeDiagram: React.FC<Props> = ({ applications, plugins }) => {
  const { nodeName } = useContext(ApplicationContext);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
    makeInitialNodes(applications, plugins, nodeName),
    makeInitialEdges(applications, plugins)
  );

  const [nodes, , onNodesChange] = useNodesState(layoutedNodes);
  const [edges, , onEdgesChange] = useEdgesState(layoutedEdges);

  if (
    !plugins ||
    !applications ||
    applications.length === 0 ||
    Object.keys(plugins ?? {}).length === 0
  ) {
    return (
      <Box
        borderRadius={DEFAULT_BORDER_RADIUS}
        sx={{
          width: '100%',
          height: `100%`,
        }}
      >
        <FFCircleLoader height="100%" color="warning" />
      </Box>
    );
  } else {
    return (
      <Box
        borderRadius={DEFAULT_BORDER_RADIUS}
        sx={{
          width: '100%',
          height: `100%`,
        }}
      >
        <ReactFlowProvider>
          {isMounted && (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              fitView
            />
          )}
        </ReactFlowProvider>
        <Typography>done</Typography>
      </Box>
    );
  }
};
