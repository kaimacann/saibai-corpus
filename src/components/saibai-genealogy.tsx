import Dagre from "@dagrejs/dagre";
import React, { useMemo, useState } from "react";
import {
  Background,
  Handle,
  Panel,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Button } from "@components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog";
import { AlertError } from "@ui/alert";
import { ErrorBoundary } from "@components/ErrorBoundary";
import { CarbonIcon } from "./carbon-icons";
import { PANEL_CLASSES, Player } from "./saibai";
import {
  getSpousePairChildren,
  markGenealogyNodeEndpoints,
} from "@lib/genealogy-endpoints";
import type { Edge as ReactFlowEdge, Node, NodeProps } from "@xyflow/react";
import type { Person } from "@lib/types";

/** React Flow node specialization used to render an individual person. */
type PersonGraphNode = Node<
  {
    nodeData: Person;
    origin: boolean;
    terminus: boolean;
    setSelectedNode: React.Dispatch<React.SetStateAction<Person | null>>;
  } & Record<string, unknown>,
  "custom"
> & { type: "custom" };

/** Either a visible person node or a marriage connector in the genealogy graph. */
type GenealogyNode =
  | PersonGraphNode
  | (Node<Record<string, never>, "marriageConnector"> & {
      type: "marriageConnector";
    });
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

/**
 * Returns the layout dimensions used for a person or marriage connector node.
 *
 * @param node - React Flow node whose layout dimensions are needed.
 * @returns Connector dimensions or the node's measured size with defaults.
 */
function getNodeDimensions(node: Node): { width: number; height: number } {
  return node.type === "marriageConnector"
    ? { width: 20, height: 20 }
    : {
        width: node.measured?.width ?? 150,
        height: node.measured?.height ?? 50,
      };
}

/**
 * Calculates Dagre positions for nodes and returns the input edges unchanged.
 *
 * @param nodes - Array of unpositioned React Flow nodes.
 * @param edges - Array of React Flow edges.
 * @param opts - Direction and optional spacing values for the layout.
 *
 * @returns Object containing nodes with updated positions and unmodified edges.
 */
function getLayoutedElements<TNode extends Node>(
  nodes: TNode[],
  edges: ReactFlowEdge[],
  opts: { direction: string; nodesep?: number; ranksep?: number },
): { edges: ReactFlowEdge[]; nodes: TNode[] } {
  /** Supplies empty metadata for graph edges without explicit labels.
   * @returns An empty label object for Dagre.
   */
  function emptyEdgeLabel(): Record<string, never> {
    return {};
  }
  const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(emptyEdgeLabel);
  g.setGraph({
    rankdir: opts.direction,
    nodesep: opts.nodesep || 50,
    ranksep: opts.ranksep || 50,
  });
  /** Adds each source relationship to Dagre's working graph.
   * @param e - React Flow edge whose endpoints define the relationship.
   */
  function addEdgeToGraph(e: ReactFlowEdge): void {
    g.setEdge(e.source, e.target);
  }
  /** Adds one node with dimensions needed by Dagre's positioning pass.
   * @param n - React Flow node to size and register.
   */
  function addNodeToGraph(n: TNode): void {
    g.setNode(n.id, { ...n, ...getNodeDimensions(n) });
  }
  edges.forEach(addEdgeToGraph);
  nodes.forEach(addNodeToGraph);
  Dagre.layout(g);

  /** Applies Dagre's center coordinates to React Flow's top-left positions.
   * @param n - Original node to position in the laid-out graph.
   * @returns The node with layout position and dragging disabled.
   */
  function positionNode(n: TNode): TNode {
    const { x, y } = g.node(n.id);
    const { width, height } = getNodeDimensions(n);
    return {
      ...n,
      position: { x: x - width / 2, y: y - height / 2 },
      draggable: false,
    };
  }
  return {
    nodes: nodes.map(positionNode),
    edges: [...edges],
  };
}

/**
 * Renders a person node in the React Flow genealogy graph.
 *
 * @remarks React Flow Custom Node to display a Person in the tree.
 *
 * @param data - Node data containing personal information and edge visibility toggles.
 * @returns The rendered person node.
 */
function PersonNode({ data }: NodeProps<PersonGraphNode>) {
  const { nodeData, setSelectedNode } = data;
  /** Finds a different person sharing the selected node's id.
   * @param p - Record checked for an id/name collision.
   * @returns Whether the record conflicts with the rendered node identity.
   */
  function hasConflictingNameForSelectedId(p: Person): boolean {
    return p.id === nodeData.id && p.name !== nodeData.name;
  }
  /** Matches the original data record represented by this rendered node.
   * @param p - Record from the source genealogy data.
   * @returns Whether the record maps uniquely to the rendered node.
   */
  function matchesSelectedPerson(p: Person): boolean {
    return (
      p.id === nodeData.id ||
      (p.name === nodeData.name &&
        !genealogyData.some(hasConflictingNameForSelectedId))
    );
  }
  /**
   * Selects the source person record or creates a detail-safe fallback.
   */
  function handleNodeClick(): void {
    const originalGNode = genealogyData.find(matchesSelectedPerson);
    setSelectedNode(
      originalGNode || {
        ...nodeData,
        spouseId: null,
        parents: [],
        children: [],
      },
    );
  }
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
function LayoutFlow({
  genealogyData,
}: {
  genealogyData: Person[];
}): React.JSX.Element {
  // STATES
  const [selNode, setSelNode] = useState<Person | null>(null);
  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState<GenealogyNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<ReactFlowEdge>([]);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // INIT
  /** Creates the person and marriage nodes plus their parent-child edges.
   * @returns Unpositioned React Flow nodes and relationship edges for Dagre.
   */
  function buildInitialGraph(): {
    initialNodes: GenealogyNode[];
    initialEdges: ReactFlowEdge[];
  } {
    const nNodes: GenealogyNode[] = [];
    const nEdges: ReactFlowEdge[] = [];
    const personNodeMap = new Map<string, Person>();
    const marriageSet = new Set<string>();
    const marriageChildEdgeSet = new Set<string>();

    /** Registers one source person as a React Flow node.
     * @param p - Source genealogy record to include in the graph.
     */
    function addPersonNode(p: Person): void {
      nNodes.push({
        id: p.id,
        type: "custom",
        data: {
          setSelectedNode: setSelNode,
          nodeData: p,
          origin: false,
          terminus: false,
        },
        position: { x: 0, y: 0 },
      });
      personNodeMap.set(p.id, p);
    }

    /** Adds a child edge from a marriage connector when its target exists.
     * @param marriageNodeId - Connector joining the two spouses.
     * @param childId - Child person id targeted by the relationship.
     */
    function addChildMarriageEdge(
      marriageNodeId: string,
      childId: string,
    ): void {
      if (!personNodeMap.has(childId)) return;
      const edgeId = `edge-${marriageNodeId}-to-${childId}`;
      if (marriageChildEdgeSet.has(edgeId)) return;
      marriageChildEdgeSet.add(edgeId);
      nEdges.push({
        id: edgeId,
        source: marriageNodeId,
        target: childId,
        type: "smoothstep",
      });
    }

    /** Adds an ordinary parent-child edge when the child is in the source list.
     * @param parentId - Person node that supplies the relationship.
     * @param childId - Child person id targeted by the relationship.
     */
    function addParentChildEdge(parentId: string, childId: string): void {
      if (!personNodeMap.has(childId)) return;
      nEdges.push({
        id: `edge-${parentId}-to-${childId}`,
        source: parentId,
        target: childId,
        type: "smoothstep",
      });
    }

    /** Adds a person's spouse connector and the connector's child edges.
     * @param person - Person record whose spouse and children are linked.
     */
    function addMarriageRelationships(person: Person): void {
      if (!person.spouseId) return;
      const primaryPersonId = person.id;
      /** Locates the source person whose id is the spouse reference.
       * @param c - Person record considered as the spouse.
       * @returns Whether the source record matches the spouse id.
       */
      function isSpouse(c: Person): boolean {
        return c.id === person.spouseId;
      }
      const spouseNodeId =
        genealogyData.find(isSpouse)?.id ||
        `spouse-node-for-${primaryPersonId}`;
      if (!personNodeMap.has(spouseNodeId)) {
        const spouseDisplayData: Person = {
          id: spouseNodeId,
          name: person.spouseId,
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
      }
      /** Connects each recorded child to this spouse pair's connector.
       * @param c - Source record id of the child.
       */
      function addMarriageChildEdge(c: string): void {
        addChildMarriageEdge(marriageNodeId, c);
      }
      getSpousePairChildren(genealogyData, person.id, person.spouseId).forEach(
        addMarriageChildEdge,
      );
    }

    /** Adds non-marriage parent-child edges for one source person.
     * @param p - Record whose children are linked directly.
     */
    function addDirectRelationships(p: Person): void {
      if (p.spouseId) {
        addMarriageRelationships(p);
        return;
      }

      /** Connects a recorded child directly when the person has no spouse.
       * @param c - Source record id of the child.
       */
      function addDirectChildEdge(c: string): void {
        addParentChildEdge(p.id, c);
      }
      p.children.forEach(addDirectChildEdge);
    }

    genealogyData.forEach(addPersonNode);
    genealogyData.forEach(addDirectRelationships);
    markGenealogyNodeEndpoints(nNodes, nEdges);
    return { initialNodes: nNodes, initialEdges: nEdges };
  }
  const { initialNodes, initialEdges } = useMemo(buildInitialGraph, [
    genealogyData,
    setSelNode,
  ]);

  /** Applies the initial Dagre layout once the source graph is available. */
  function initGraphLayout(): void {
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
  }
  React.useEffect(initGraphLayout, [
    initialNodes,
    initialEdges,
    setNodes,
    setEdges,
  ]);

  /** Fits the graph when its container first becomes visible. */
  function fitVisibleGraph(): void {
    fitView();
  }

  /** Re-centers the graph after its container enters the viewport.
   * @param entries - Intersection records reported for the observed container.
   */
  function handleContainerVisibility(
    entries: IntersectionObserverEntry[],
  ): void {
    // This observer is attached to one graph container, so only its first entry matters.
    const entry = entries[0];
    if (entry?.isIntersecting) {
      window.requestAnimationFrame(fitVisibleGraph);
    }
  }

  /** Releases the observer registered for the graph container.
   * @param observer - Browser observer watching the genealogy container.
   */
  function disconnectContainerObserver(observer: IntersectionObserver): void {
    observer.disconnect();
  }

  /** Observes the graph container and returns React's observer cleanup callback.
   * @returns A callback that disconnects the observer, or undefined before mount.
   */
  function observeGraphContainer(): (() => void) | undefined {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(handleContainerVisibility, {
      threshold: 0.1,
    });
    observer.observe(containerRef.current);
    /** Disconnects the observer when React removes the graph container. */
    function cleanupObserver(): void {
      disconnectContainerObserver(observer);
    }
    return cleanupObserver;
  }
  React.useEffect(observeGraphContainer, [fitView]);

  /** Applies the requested graph direction and recenters its visible nodes.
   * @param direction - Dagre rank direction, such as `TB` or `LR`.
   */
  function onLayout(direction: string): void {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodes,
      edges,
      {
        direction,
        nodesep: 70,
        ranksep: 90,
      },
    );
    setNodes([...layoutedNodes]);
    setEdges([...layoutedEdges]);
    window.requestAnimationFrame(fitVisibleGraph);
  }

  /** Requests the vertical layout used by the panel's layout button. */
  function handleVerticalLayout(): void {
    onLayout("TB");
  }

  /** Clears the selected person after the details dialog closes.
   * @param i - Whether the dialog remains open after the change.
   */
  function handlePersonDialogChange(i: boolean): void {
    if (!i) setSelNode(null);
  }

  /** Capitalizes the first character of a display name segment.
   * @param character - Name segment whose initial should be uppercased.
   * @returns The segment's initial character in uppercase.
   */
  function capitalizeInitial(character: string): string {
    return character.toUpperCase();
  }

  /** Converts a source person id into the visible child name.
   * @param p - Genealogy id containing the name before its first hyphen.
   * @returns The capitalized name segment, or undefined for an empty id.
   */
  function getChildName(p: string): string | undefined {
    return p.split("-")[0]?.replace(SHARED_REGEX, capitalizeInitial);
  }

  /** Renders an audio item attached to the selected genealogy person.
   * @param r - Audio metadata from the person's genealogy record.
   * @returns The recording's player row.
   */
  function renderPersonAudio(
    r: NonNullable<Person["audio"]>[number],
  ): React.JSX.Element {
    return (
      <Player key={r.audio} title={r.title} author={r.author} src={r.audio} />
    );
  }

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
            onClick={handleVerticalLayout}
            title="Vertical Layout"
            aria-label="Vertical Layout"
            variant="gray-outline"
            size="icon"
          >
            <CarbonIcon name="maximize" />
          </Button>
        </Panel>
        <Dialog open={!!selNode} onOpenChange={handlePersonDialogChange}>
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
                        .replace(SHARED_REGEX, capitalizeInitial)}
                    </p>
                  )}
                  {selNode.children.length > 0 && (
                    <p className="text-cyan-900/70">
                      Children: {selNode.children.map(getChildName).join(", ")}
                    </p>
                  )}
                </DialogHeader>
                <div className="flex flex-col gap-y-3 pt-2">
                  {selNode.audio?.map(renderPersonAudio)}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </ReactFlow>
    </div>
  );
}

/**
 * Renders the genealogy component.
 *
 * @remarks Exposes the top-level ReactFlowProvider wrapper for the LayoutFlow diagram.
 *
 * @returns Tree provider hierarchy.
 */
export function Genealogy(): React.JSX.Element {
  /**
   * Renders a focused fallback when genealogy rendering fails.
   *
   * @return Accessible error alert for an unavailable genealogy graph.
   */
  function renderGenealogyErr(): React.JSX.Element {
    return (
      <AlertError
        title="Genealogy Tree Error"
        description="The genealogy diagram of the Saibai families could not be displayed. The rest of the page remains fully accessible."
      />
    );
  }

  return (
    <ErrorBoundary name="SaibaiGenealogy" fallback={renderGenealogyErr}>
      <div className={PANEL_CLASSES}>
        <ReactFlowProvider>
          <LayoutFlow genealogyData={genealogyData} />
        </ReactFlowProvider>
      </div>
    </ErrorBoundary>
  );
}
