import Dagre from "@dagrejs/dagre";
import React, { useCallback, useMemo, useState } from "react";
import { Background, Handle, Panel, Position, ReactFlow, ReactFlowProvider, useEdgesState, useNodesState, useReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Button } from "@components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@components/ui/dialog";
import { AlertError } from "@ui/alert";
import { ErrorBoundary } from "@components/ErrorBoundary";
import { CarbonIcon } from "./carbon-icons";
import { PANEL_CLASSES, Player } from "./saibai";
import type { Edge as ReactFlowEdge, Node, NodeProps } from "@xyflow/react";
import type { Person, SaibaiFlowNode as FlowNode } from "@lib/types";

/** React Flow payload for a person node, including its person record fields. */
type PersonNodeData = FlowNode & Record<string, unknown>;
/** React Flow node specialization used to render an individual person. */
type PersonGraphNode = Node<PersonNodeData, "custom"> & { type: "custom" };
/** Layout-only React Flow node used to connect spouses in the genealogy graph. */
type MarriageGraphNode = Node<Record<string, never>, "marriageConnector"> & {
  type: "marriageConnector";
};
/** Either a visible person node or a marriage connector in the genealogy graph. */
type GenealogyNode = PersonGraphNode | MarriageGraphNode;
const SHARED_REGEX = /^./;

const genealogyData: Person[] = [
  {
    id: "gemetu-0",
    name: "Gemetu",
    spouseId: "kokeu-0",
    parents: [],
    children: ["giwa-1", "asa-1", "asaii-1", "kaigab-1", "nancy-1"],
    clans: ["Daibau"],
    audio: [
      {
        title: "Maduba na puidam",
        author: "Gemetu (singer, male)",
        audio:
          "https://www.true-echoes.com/wp-content/uploads/025A-C0080X1077XX-0100M0.mp3",
        date: "",
        source: "Wax Cylinders",
      },
      {
        title: "Mawau na puidam",
        author: "Gemetu (singer, male)",
        audio:
          "https://www.true-echoes.com/wp-content/uploads/025A-C0080X1079XX-0100M0.mp3",
        date: "",
        source: "Wax Cylinders",
      },
    ],
  },
  {
    id: "kokeu-0",
    name: "Kokeu",
    spouseId: "gemetu-0",
    parents: [],
    children: ["giwa-1", "asa-1", "asaii-1", "kaigab-1", "nancy-1"],
    clans: ["Samu"],
  },
  {
    id: "giwa-1",
    name: "Giwa",
    spouseId: null,
    parents: ["gemetu-0", "kokeu-0"],
    children: [],
    clans: [],
  },
  {
    id: "asa-1",
    name: "Asa",
    spouseId: "kargar-1",
    parents: ["gemetu-0", "kokeu-0"],
    children: [
      "warusam-2",
      "nganabusa-2",
      "aniba-2",
      "warubam-2",
      "wodi-2",
      "tamu-2",
    ],
    clans: ["Daibau"],
  },
  {
    id: "kargar-1",
    name: "Kargar",
    spouseId: "asa-1",
    parents: [],
    children: [
      "warusam-2",
      "nganabusa-2",
      "aniba-2",
      "warubam-2",
      "wodi-2",
      "tamu-2",
    ],
    clans: ["Kodal"],
  },
  {
    id: "warusam-2",
    name: "Warusam",
    spouseId: null,
    parents: ["asa-1", "kargar-1"],
    children: [],
    clans: ["Daibau"],
  },
  {
    id: "nganabusa-2",
    name: "Nganabusa",
    spouseId: null,
    parents: ["asa-1", "kargar-1"],
    children: [],
    clans: ["Daibau"],
  },
  {
    id: "aniba-2",
    name: "Aniba",
    spouseId: null,
    parents: ["asa-1", "kargar-1"],
    children: [],
    clans: ["Daibau"],
  },
  {
    id: "warubam-2",
    name: "Warubam",
    spouseId: null,
    parents: ["asa-1", "kargar-1"],
    children: [],
    clans: ["Daibau"],
  },
  {
    id: "wodi-2",
    name: "Wodi",
    spouseId: "tamu-2",
    parents: ["asa-1", "kargar-1"],
    children: ["baideu-3", "teniu-3", "mudu-3", "danazur-3"],
    clans: ["Samu"],
  },
  {
    id: "tamu-2",
    name: "Tamu",
    spouseId: "wodi-2",
    parents: ["asa-1", "kargar-1"],
    children: ["baideu-3", "teniu-3", "mudu-3", "danazur-3"],
    clans: ["Daibau"],
  },
  {
    id: "baideu-3",
    name: "Baideu",
    spouseId: null,
    parents: ["wodi-2", "tamu-2"],
    children: [],
    clans: ["Samu"],
  },
  {
    id: "teniu-3",
    name: "Teniu",
    spouseId: null,
    parents: ["wodi-2", "tamu-2"],
    children: [],
    clans: ["Samu"],
  },
  {
    id: "mudu-3",
    name: "Mudu",
    spouseId: null,
    parents: ["wodi-2", "tamu-2"],
    children: [],
    clans: ["Samu"],
  },
  {
    id: "danazur-3",
    name: "Danazur",
    spouseId: null,
    parents: ["wodi-2", "tamu-2"],
    children: [],
    clans: ["Samu"],
  },
  {
    id: "asaii-1",
    name: "Asaii",
    spouseId: "kawk-1",
    parents: ["gemetu-0", "kokeu-0"],
    children: ["giwa-2", "ngangabunga-2", "uniba-2"],
    clans: ["Daibau"],
  },
  {
    id: "kawk-1",
    name: "Kawk",
    spouseId: "asaii-1",
    parents: [],
    children: ["giwa-2", "ngangabunga-2", "uniba-2"],
    clans: ["Samu"],
  },
  {
    id: "giwa-2",
    name: "Giwa",
    spouseId: null,
    parents: ["kawk-1", "asaii-1"],
    children: [],
    clans: ["Daibau"],
  },
  {
    id: "ngangabunga-2",
    name: "Ngangabunga",
    spouseId: null,
    parents: ["kawk-1", "asaii-1"],
    children: [],
    clans: ["Samu"],
  },
  {
    id: "uniba-2",
    name: "Uniba",
    spouseId: null,
    parents: ["kawk-1", "asaii-1"],
    children: [],
    clans: ["Samu"],
  },
  {
    id: "saibai-2",
    name: "Saibai",
    spouseId: "kaigab-1",
    parents: [],
    children: [],
    clans: ["Tabu"],
  },
  {
    id: "kaigab-1",
    name: "Kaigab",
    spouseId: "saibai-2",
    parents: ["gemetu-0", "kokeu-0"],
    children: [],
    clans: ["Tabu"],
  },
  {
    id: "nancy-1",
    name: "Nancy",
    spouseId: null,
    parents: ["gemetu-0", "kokeu-0"],
    children: [],
    clans: [],
  },
];

const getNodeDimensions = (node: Node) =>
  node.type === "marriageConnector"
    ? { width: 20, height: 20 }
    : {
        width: node.measured?.width ?? 150,
        height: node.measured?.height ?? 50,
      };

/**
 * Handles get layouted elements.
 *
 * @remarks Calculates directed acyclic graph layout using Dagre.
 *
 * @param nodes - Array of unpositioned React Flow nodes.
 * @param edges - Array of React Flow edges.
 * @param options - Optional config for the operation.
 *
 * @returns Object containing nodes with updated positions and unmodified edges.
 */
const getLayoutedElements = <TNode extends Node>(
  nodes: TNode[],
  edges: ReactFlowEdge[],
  opts: { direction: string; nodesep?: number; ranksep?: number },
): { edges: ReactFlowEdge[]; nodes: TNode[] } => {
  const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  g.setGraph({
    rankdir: opts.direction,
    nodesep: opts.nodesep || 50,
    ranksep: opts.ranksep || 50,
  });
  edges.forEach((e) => g.setEdge(e.source, e.target));
  nodes.forEach((n) => g.setNode(n.id, { ...n, ...getNodeDimensions(n) }));
  Dagre.layout(g);
  return {
    nodes: nodes.map((n) => {
      const { x, y } = g.node(n.id);
      const { width, height } = getNodeDimensions(n);
      return {
        ...n,
        position: { x: x - width / 2, y: y - height / 2 },
        draggable: false,
      };
    }),
    edges: [...edges],
  };
};

/**
 * Renders the person node component.
 *
 * @remarks React Flow Custom Node to display a Person in the tree.
 *
 * @param props - React Flow node properties containing the person data and canvas interaction callbacks.
 * @param data - Node data containing personal information and edge visibility toggles.
 * @returns Person Node.
 */
function PersonNode({ data }: NodeProps<PersonGraphNode>) {
  const { nodeData, setSelectedNode } = data;
  /**
   * Handles node click.
   */
  const handleNodeClick = () => {
    const originalGNode = genealogyData.find(
      (g) =>
        g.id === nodeData.id ||
        (g.name === nodeData.name &&
          !genealogyData.some(
            (p) => p.id === nodeData.id && p.name !== nodeData.name,
          )),
    );
    setSelectedNode(
      originalGNode || {
        ...nodeData,
        spouseId: null,
        parents: [],
        children: [],
      },
    );
  };
  return (
    <Button
      onClick={handleNodeClick}
      disabled={!nodeData.audio}
      size="xl"
      className="h-20 max-w-48 flex-col gap-0 text-pretty px-4 py-2"
    >
      <div className="text-center">{nodeData.name}</div>
      {nodeData.clans.length > 0 && (
        <div className="mt-1 text-center text-xs opacity-80">
          {nodeData.clans.join(", ")}
        </div>
      )}
      {nodeData.annotations && nodeData.annotations.length > 0 && (
        <div className="mt-1 text-center text-xs italic">
          {nodeData.annotations.join(", ")}
        </div>
      )}
      {data.origin && (
        <Handle
          type="target"
          position={Position.Top}
          className="!size-2 !border-none !bg-cyan-600"
        />
      )}
      {data.terminus && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="!size-2 !border-none !bg-cyan-600"
        />
      )}
    </Button>
  );
}

/**
 * Renders the marriage connector node component.
 *
 * @remarks Invisible intermediary node that joins two spouses and stems down to children.
 *
 * @returns Div element styling the marriage node and Handle connectors.
 */
function MarriageConnectorNode() {
  return (
    <>
      <div
        style={{
          width: "12px",
          height: "12px",
          backgroundColor: "#A0A0A0",
          borderRadius: "50%",
          border: "1px solid #666",
        }}
      />
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: "transparent",
          border: "none",
          width: "1px",
          height: "1px",
          top: "-5px",
        }}
        isConnectable={true}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: "transparent",
          border: "none",
          width: "1px",
          height: "1px",
          bottom: "-5px",
        }}
        isConnectable={true}
      />
    </>
  );
}

const nodeTypes = {
  custom: PersonNode,
  marriageConnector: MarriageConnectorNode,
};

/**
 * Renders the layout flow component.
 *
 * @remarks Coordinates graph state, Dagre layout initialization, and modal interaction for the Genealogy tree.
 *
 * @param genealogyData - Array of Person records defining the tree structure.
 *
 *
 * @returns React Flow map interface with layout controls and item inspection modal.
 */
const LayoutFlow = ({ genealogyData }: { genealogyData: Person[] }) => {
  // STATES
  const [selNode, setSelNode] = useState<Person | null>(null);
  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState<GenealogyNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<ReactFlowEdge>([]);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // INIT
  const { initialNodes, initialEdges } = useMemo(() => {
    const nNodes: GenealogyNode[] = [];
    const nEdges: ReactFlowEdge[] = [];
    const personNodeMap = new Map<string, Person>();
    const marriageSet = new Set<string>();
    genealogyData.forEach((g) => {
      nNodes.push({
        id: g.id,
        type: "custom",
        data: {
          setSelectedNode: setSelNode,
          nodeData: g,
          origin: false,
          terminus: false,
        },
        position: { x: 0, y: 0 },
      });
      personNodeMap.set(g.id, g);
    });
    genealogyData.forEach((g) => {
      if (g.spouseId) {
        const primaryPersonId = g.id;
        const spouseNodeId =
          genealogyData.find((p) => p.id === g.spouseId)?.id ||
          `spouse-node-for-${primaryPersonId}`;
        if (!personNodeMap.has(spouseNodeId)) {
          const spouseDisplayData: Person = {
            id: spouseNodeId,
            name: g.spouseId,
            clans: [],
            parents: [],
            children: [],
            spouseId: primaryPersonId,
          };
          nNodes.push({
            id: spouseNodeId,
            type: "custom",
            data: {
              setSelectedNode: setSelNode,
              nodeData: spouseDisplayData,
              origin: false,
              terminus: false,
            },
            position: { x: 0, y: 0 },
          });
          personNodeMap.set(spouseNodeId, spouseDisplayData);
        }
        // Deduplicate structural relationships
        const sortedIds = [primaryPersonId, spouseNodeId].sort();
        const marriageNodeId = `marriage-${sortedIds[0]}-${sortedIds[1]}`;
        if (!marriageSet.has(marriageNodeId)) {
          marriageSet.add(marriageNodeId);
          nNodes.push({
            id: marriageNodeId,
            type: "marriageConnector",
            data: {},
            position: { x: 0, y: 0 },
          });
          nEdges.push({
            id: `edge-${primaryPersonId}-to-${marriageNodeId}`,
            source: primaryPersonId,
            target: marriageNodeId,
            type: "smoothstep",
            style: { strokeDasharray: "5,5", stroke: "#888" },
          });
          nEdges.push({
            id: `edge-${spouseNodeId}-to-${marriageNodeId}`,
            source: spouseNodeId,
            target: marriageNodeId,
            type: "smoothstep",
            style: { strokeDasharray: "5,5", stroke: "#888" },
          });
          g.children.forEach((c) => {
            if (personNodeMap.has(c)) {
              nEdges.push({
                id: `edge-${marriageNodeId}-to-${c}`,
                source: marriageNodeId,
                target: c,
                type: "smoothstep",
              });
            }
          });
        }
      } else {
        g.children.forEach((c) => {
          if (personNodeMap.has(c))
            nEdges.push({
              id: `edge-${g.id}-to-${c}`,
              source: g.id,
              target: c,
              type: "smoothstep",
            });
        });
      }
    });
    const tgts = new Set(nEdges.map((e) => e.target));
    const srcs = new Set(nEdges.map((e) => e.source));
    nNodes.forEach((n) => {
      if (n.type === "custom") {
        n.data.origin = tgts.has(n.id);
        n.data.terminus = srcs.has(n.id);
      }
    });
    return { initialNodes: nNodes, initialEdges: nEdges };
  }, [genealogyData, setSelNode]);

  React.useEffect(() => {
    if (initialNodes.length > 0) {
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements(initialNodes, initialEdges, {
          direction: "TB",
          nodesep: 70,
          ranksep: 90,
        });
      setNodes(layoutedNodes as GenealogyNode[]);
      setEdges(layoutedEdges);
      // Native `fitView` React Flow prop correctly manages initial bounding box measurements safely.
    }
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  React.useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          window.requestAnimationFrame(() => {
            fitView();
          });
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(containerRef.current);
    return () => {
      observer.disconnect();
    };
  }, [fitView]);

  const onLayout = useCallback(
    (direction: string) => {
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements(nodes, edges, {
          direction,
          nodesep: 70,
          ranksep: 90,
        });
      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
      window.requestAnimationFrame(() => fitView());
    },
    [nodes, edges, setNodes, setEdges, fitView],
  );

  return (
    <div ref={containerRef} className="size-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.1}
        className="size-full"
      >
        <Background />
        <Panel position="top-right">
          <Button
            type="button"
            onClick={() => {
              onLayout("TB");
            }}
            title="Vertical Layout"
            aria-label="Vertical Layout"
            variant="gray-outline"
            size="icon"
          >
            <CarbonIcon name="maximize" />
          </Button>
        </Panel>
        <Dialog open={!!selNode} onOpenChange={(o) => !o && setSelNode(null)}>
          <DialogContent
            aria-describedby={undefined}
            className="text-clip text-left"
          >
            {selNode && (
              <>
                <DialogHeader>
                  <DialogTitle className="font-mono text-4xl font-bold">
                    {selNode.name}
                  </DialogTitle>
                  <DialogDescription className="sr-only">
                    Details for {selNode.name}
                  </DialogDescription>
                  {selNode.clans.length > 0 && (
                    <p className="text-cyan-900/70">
                      Clan: {selNode.clans.join(", ")}
                    </p>
                  )}
                  {selNode.spouseId && (
                    <p className="text-cyan-900/70">
                      Spouse:{" "}
                      {selNode.spouseId
                        .split("-")[0]
                        .replace(SHARED_REGEX, (c) => c.toUpperCase())}
                    </p>
                  )}
                  {selNode.children.length > 0 && (
                    <p className="text-cyan-900/70">
                      Children:{" "}
                      {selNode.children
                        .map((i) =>
                          i
                            .split("-")[0]
                            ?.replace(SHARED_REGEX, (c) => c.toUpperCase()),
                        )
                        .join(", ")}
                    </p>
                  )}
                </DialogHeader>
                <div className="flex flex-col gap-y-3 pt-2">
                  {selNode.audio?.map(({ title: t, author: a, audio: v }) => (
                    <Player key={v} title={t} author={a} src={v} />
                  ))}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </ReactFlow>
    </div>
  );
};

/**
 * Renders the genealogy component.
 *
 * @remarks Exposes the top-level ReactFlowProvider wrapper for the LayoutFlow diagram.
 *
 * @returns Tree provider hierarchy.
 */
export function Genealogy(): React.JSX.Element {
  return (
    <ErrorBoundary
      name="SaibaiGenealogy"
      fallback={() => (
        <AlertError
          title="Genealogy Tree Error"
          description="The genealogy diagram of the Saibai families could not be displayed. The rest of the page remains fully accessible."
        />
      )}
    >
      <div className={PANEL_CLASSES}>
        <ReactFlowProvider>
          <LayoutFlow genealogyData={genealogyData} />
        </ReactFlowProvider>
      </div>
    </ErrorBoundary>
  );
}

