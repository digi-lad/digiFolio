import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Play, Check, RotateCw, Shuffle } from 'lucide-react';
import { Button } from './Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './Dialog';
import { applyForceDirectedLayout } from '../helpers/forceDirectedLayout';
import styles from './ShortestPathGame.module.css';

// --- Types ---
type Node = {
  id: string;
  x: number;
  y: number;
};

type Edge = {
  from: string;
  to: string;
  weight: number;
};

type Graph = {
  nodes: Node[];
  edges: Edge[];
};

type AnimationFrame = {
  type: 'VISITING' | 'UPDATING' | 'FINAL_PATH';
  nodeId: string;
  distance?: number;
  path?: string[];
  visited?: Set<string>;
  queue?: string[];
};

// --- Constants ---
const NODE_COUNT_MIN = 8;
const NODE_COUNT_MAX = 10;
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 500;
const PADDING = 60;
const NODE_RADIUS = 20;
const MIN_NODE_DISTANCE = NODE_RADIUS * 4;

// --- Helper Functions ---

const generateGraph = (): { graph: Graph; startNodeId: string; endNodeId: string } => {
  const nodes: Node[] = [];
  const nodeCount = Math.floor(Math.random() * (NODE_COUNT_MAX - NODE_COUNT_MIN + 1)) + NODE_COUNT_MIN;

  // Generate initial random node positions
  for (let i = 0; i < nodeCount; i++) {
    let x, y, tooClose;
    do {
      tooClose = false;
      x = Math.random() * (CANVAS_WIDTH - PADDING * 2) + PADDING;
      y = Math.random() * (CANVAS_HEIGHT - PADDING * 2) + PADDING;
      for (const node of nodes) {
        const dist = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
        if (dist < MIN_NODE_DISTANCE) {
          tooClose = true;
          break;
        }
      }
    } while (tooClose);
    nodes.push({ id: `node-${i}`, x, y });
  }

  const edges: Edge[] = [];
  const edgeSet = new Set<string>();

  // Ensure connectivity by creating a spanning tree
  const unvisited = new Set(nodes.map(n => n.id));
  const visited = new Set<string>();
  const start = nodes[0].id;
  unvisited.delete(start);
  visited.add(start);

  while (unvisited.size > 0) {
    const fromNodeId = Array.from(visited)[Math.floor(Math.random() * visited.size)];
    const toNodeId = Array.from(unvisited)[Math.floor(Math.random() * unvisited.size)];
    
    const edgeKey1 = `${fromNodeId}-${toNodeId}`;
    const edgeKey2 = `${toNodeId}-${fromNodeId}`;

    if (!edgeSet.has(edgeKey1) && !edgeSet.has(edgeKey2)) {
      edges.push({ from: fromNodeId, to: toNodeId, weight: Math.floor(Math.random() * 10) + 1 });
      edgeSet.add(edgeKey1);
      edgeSet.add(edgeKey2);
      visited.add(toNodeId);
      unvisited.delete(toNodeId);
    }
  }

  // Add some extra edges for complexity
  const extraEdges = Math.ceil(nodeCount * 0.5);
  for (let i = 0; i < extraEdges; i++) {
    const fromNodeId = nodes[Math.floor(Math.random() * nodeCount)].id;
    const toNodeId = nodes[Math.floor(Math.random() * nodeCount)].id;
    if (fromNodeId === toNodeId) continue;

    const edgeKey1 = `${fromNodeId}-${toNodeId}`;
    const edgeKey2 = `${toNodeId}-${fromNodeId}`;

    if (!edgeSet.has(edgeKey1) && !edgeSet.has(edgeKey2)) {
      edges.push({ from: fromNodeId, to: toNodeId, weight: Math.floor(Math.random() * 10) + 1 });
      edgeSet.add(edgeKey1);
      edgeSet.add(edgeKey2);
    }
  }

  // Apply force-directed layout
  const layoutedNodes = applyForceDirectedLayout(nodes, edges, CANVAS_WIDTH, CANVAS_HEIGHT, PADDING);

  // Select start and end nodes that are far apart
  const canvasDiagonal = Math.sqrt(CANVAS_WIDTH ** 2 + CANVAS_HEIGHT ** 2);
  const minDistance = canvasDiagonal * 0.6; // At least 60% of diagonal
  
  // Calculate all pairwise distances
  const distances: { nodeA: string; nodeB: string; distance: number }[] = [];
  for (let i = 0; i < layoutedNodes.length; i++) {
    for (let j = i + 1; j < layoutedNodes.length; j++) {
      const nodeA = layoutedNodes[i];
      const nodeB = layoutedNodes[j];
      const dist = Math.sqrt((nodeB.x - nodeA.x) ** 2 + (nodeB.y - nodeA.y) ** 2);
      distances.push({ nodeA: nodeA.id, nodeB: nodeB.id, distance: dist });
    }
  }
  
  // Sort by distance descending
  distances.sort((a, b) => b.distance - a.distance);
  
  // Get top 25% of distances
  const top25PercentCount = Math.max(1, Math.floor(distances.length * 0.25));
  const farPairs = distances.slice(0, top25PercentCount);
  
  let startNodeId: string;
  let endNodeId: string;
  
  // Try to find a pair that meets minimum distance
  const validPair = farPairs.find(pair => pair.distance >= minDistance);
  
  if (validPair) {
    startNodeId = validPair.nodeA;
    endNodeId = validPair.nodeB;
    console.log(`Selected START and END nodes with distance: ${validPair.distance.toFixed(2)}`);
  } else {
    // If no pair meets threshold, select from furthest pairs available
    const selectedPair = farPairs[0];
    startNodeId = selectedPair.nodeA;
    endNodeId = selectedPair.nodeB;
    console.log(`Selected START and END nodes from furthest available: ${selectedPair.distance.toFixed(2)}`);
  }

  return { graph: { nodes: layoutedNodes, edges }, startNodeId, endNodeId };
};

const runDijkstra = (graph: Graph, startNodeId: string, endNodeId: string) => {
  const { nodes, edges } = graph;
  const distances: { [key: string]: number } = {};
  const prev: { [key: string]: string | null } = {};
  const pq = new Set<string>();
  const animationFrames: AnimationFrame[] = [];

  nodes.forEach(node => {
    distances[node.id] = Infinity;
    prev[node.id] = null;
    pq.add(node.id);
  });

  distances[startNodeId] = 0;

  const adj = new Map<string, { neighborId: string; weight: number }[]>();
  edges.forEach(edge => {
    if (!adj.has(edge.from)) adj.set(edge.from, []);
    if (!adj.has(edge.to)) adj.set(edge.to, []);
    adj.get(edge.from)!.push({ neighborId: edge.to, weight: edge.weight });
    adj.get(edge.to)!.push({ neighborId: edge.from, weight: edge.weight });
  });

  const visitedInAnimation = new Set<string>();

  while (pq.size > 0) {
    let u: string | null = null;
    let minDistance = Infinity;
    pq.forEach(nodeId => {
      if (distances[nodeId] < minDistance) {
        minDistance = distances[nodeId];
        u = nodeId;
      }
    });

    if (u === null) break;
    pq.delete(u);
    visitedInAnimation.add(u);

    animationFrames.push({ type: 'VISITING', nodeId: u, distance: distances[u], visited: new Set(visitedInAnimation), queue: Array.from(pq) });

    if (u === endNodeId) break;

    const neighbors = adj.get(u) || [];
    for (const { neighborId, weight } of neighbors) {
      if (pq.has(neighborId)) {
        const alt = distances[u] + weight;
        if (alt < distances[neighborId]) {
          distances[neighborId] = alt;
          prev[neighborId] = u;
          animationFrames.push({ type: 'UPDATING', nodeId: neighborId, distance: alt, visited: new Set(visitedInAnimation), queue: Array.from(pq) });
        }
      }
    }
  }

  const path: string[] = [];
  let current: string | null = endNodeId;
  while (current) {
    path.unshift(current);
    current = prev[current];
  }

  if (path[0] !== startNodeId) {
    return { path: [], weight: Infinity, animationFrames: [] };
  }

  for (let i = 0; i < path.length; i++) {
    animationFrames.push({ type: 'FINAL_PATH', nodeId: path[i], path: path.slice(0, i + 1) });
  }

  return { path, weight: distances[endNodeId], animationFrames };
};


export const ShortestPathGame = ({ className }: { className?: string }) => {
  const [graph, setGraph] = useState<Graph>({ nodes: [], edges: [] });
  const [startNodeId, setStartNodeId] = useState<string>('');
  const [endNodeId, setEndNodeId] = useState<string>('');
  const [shortestPath, setShortestPath] = useState<{ path: string[]; weight: number; animationFrames: AnimationFrame[] }>({ path: [], weight: 0, animationFrames: [] });
  
  const [userPath, setUserPath] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string>('');
  
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationFrame, setAnimationFrame] = useState<AnimationFrame | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Drag state
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [dragStartPos, setDragStartPos] = useState<{ x: number; y: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Responsive sizing state
  const [viewBox, setViewBox] = useState({ width: CANVAS_WIDTH, height: CANVAS_HEIGHT });

  const adjList = useMemo(() => {
    const adj = new Map<string, { neighborId: string; weight: number }[]>();
    graph.edges.forEach(edge => {
      if (!adj.has(edge.from)) adj.set(edge.from, []);
      if (!adj.has(edge.to)) adj.set(edge.to, []);
      adj.get(edge.from)!.push({ neighborId: edge.to, weight: edge.weight });
      adj.get(edge.to)!.push({ neighborId: edge.from, weight: edge.weight });
    });
    return adj;
  }, [graph.edges]);

  const userPathWeight = useMemo(() => {
    let weight = 0;
    for (let i = 0; i < userPath.length - 1; i++) {
      const edge = graph.edges.find(e => 
        (e.from === userPath[i] && e.to === userPath[i+1]) || 
        (e.to === userPath[i] && e.from === userPath[i+1])
      );
      if (edge) weight += edge.weight;
    }
    return weight;
  }, [userPath, graph.edges]);

  const initializeGame = useCallback(() => {
    const { graph: newGraph, startNodeId: newStart, endNodeId: newEnd } = generateGraph();
    setGraph(newGraph);
    setStartNodeId(newStart);
    setEndNodeId(newEnd);
    const solution = runDijkstra(newGraph, newStart, newEnd);
    setShortestPath(solution);
    setUserPath([newStart]);
    setFeedback('');
    setIsAnimating(false);
    setAnimationFrame(null);
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Handle container resizing
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        
        // Maintain aspect ratio
        const aspectRatio = CANVAS_WIDTH / CANVAS_HEIGHT;
        const containerAspectRatio = width / height;
        
        let newWidth = CANVAS_WIDTH;
        let newHeight = CANVAS_HEIGHT;
        
        if (containerAspectRatio > aspectRatio) {
          // Container is wider - fit to height
          newHeight = CANVAS_HEIGHT;
          newWidth = newHeight * containerAspectRatio;
        } else {
          // Container is taller - fit to width
          newWidth = CANVAS_WIDTH;
          newHeight = newWidth / containerAspectRatio;
        }
        
        setViewBox({ width: newWidth, height: newHeight });
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const handleNodeClick = (nodeId: string) => {
    if (isAnimating || userPath.includes(nodeId) || userPath[userPath.length - 1] === endNodeId) return;

    const lastNodeId = userPath[userPath.length - 1];
    const neighbors = adjList.get(lastNodeId)?.map(n => n.neighborId) || [];
    
    if (neighbors.includes(nodeId)) {
      setUserPath(prev => [...prev, nodeId]);
      setFeedback('');
    }
  };

  const handleMouseDown = (e: React.MouseEvent<SVGCircleElement>, nodeId: string) => {
    if (isAnimating) return;
    e.stopPropagation();
    setDraggedNodeId(nodeId);
    const node = getNodeById(nodeId);
    if (node) {
      setDragStartPos({ x: node.x, y: node.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!draggedNodeId || !svgRef.current) return;

    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    
    const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());
    
    // Keep node within bounds
    const boundedX = Math.max(PADDING, Math.min(CANVAS_WIDTH - PADDING, svgP.x));
    const boundedY = Math.max(PADDING, Math.min(CANVAS_HEIGHT - PADDING, svgP.y));

    setGraph(prevGraph => ({
      ...prevGraph,
      nodes: prevGraph.nodes.map(node =>
        node.id === draggedNodeId
          ? { ...node, x: boundedX, y: boundedY }
          : node
      ),
    }));
  };

  const handleMouseUp = (e: React.MouseEvent<SVGSVGElement>) => {
    if (draggedNodeId) {
      const node = getNodeById(draggedNodeId);
      const hasMoved = dragStartPos && node && 
        (Math.abs(node.x - dragStartPos.x) > 3 || Math.abs(node.y - dragStartPos.y) > 3);
      
      // Clear drag state before processing click
      const nodeIdForClick = draggedNodeId;
      setDraggedNodeId(null);
      setDragStartPos(null);
      
      // If we didn't move much, treat it as a click
      if (!hasMoved) {
        handleNodeClick(nodeIdForClick);
      }
    }
  };

  const handleReset = () => {
    setUserPath([startNodeId]);
    setFeedback('');
    setIsAnimating(false);
    setAnimationFrame(null);
  };

  const handleCheckPath = () => {
    if (userPath[userPath.length - 1] !== endNodeId) {
      setFeedback("incomplete|Your path hasn't reached the END node yet.");
      return;
    }
    if (userPathWeight === shortestPath.weight) {
      setFeedback(`success|Correct! You found the shortest path with weight ${userPathWeight}.`);
    } else {
      setFeedback(`error|Not quite. Your path weight is ${userPathWeight}, but the shortest is ${shortestPath.weight}.`);
    }
  };

  const handleShowSolution = () => {
    handleReset();
    setIsAnimating(true);
    let frameIndex = 0;
    const interval = setInterval(() => {
      if (frameIndex >= shortestPath.animationFrames.length) {
        clearInterval(interval);
        setIsAnimating(false);
        setTimeout(() => setIsDialogOpen(true), 500);
        return;
      }
      setAnimationFrame(shortestPath.animationFrames[frameIndex]);
      frameIndex++;
    }, 200);
  };

  const handleRandomizeGraph = () => {
    console.log('Generating new random graph with force-directed layout');
    initializeGame();
  };

  const getNodeById = (id: string) => graph.nodes.find(n => n.id === id);

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <div className={styles.controls}>
        <div className={styles.buttons}>
          <Button onClick={handleCheckPath} disabled={isAnimating}><Check size={16} /> Check My Path</Button>
          <Button onClick={handleShowSolution} disabled={isAnimating} variant="secondary"><Play size={16} /> Show Dijkstra's Solution</Button>
          <Button onClick={handleReset} disabled={isAnimating} variant="outline"><RotateCw size={16} /> Reset</Button>
          <Button onClick={handleRandomizeGraph} disabled={isAnimating} variant="outline"><Shuffle size={16} /> Randomize Graph</Button>
        </div>
        <div className={styles.info}>
          <p>Your Path Weight: <span className={styles.weightValue}>{userPathWeight}</span></p>
          {feedback && (
            <p className={`${styles.feedback} ${
              feedback.startsWith('success|') ? styles.feedbackSuccess :
              feedback.startsWith('error|') ? styles.feedbackError :
              styles.feedbackWarning
            }`}>
              {feedback.split('|')[1] || feedback}
            </p>
          )}
        </div>
      </div>
      <div className={styles.svgContainer} ref={containerRef}>
        <div className={styles.scanlineOverlay}></div>
        <svg 
          ref={svgRef}
          viewBox={`0 0 ${viewBox.width} ${viewBox.height}`} 
          className={styles.svgCanvas}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Edges */}
          {graph.edges.map((edge, i) => {
            const fromNode = getNodeById(edge.from);
            const toNode = getNodeById(edge.to);
            if (!fromNode || !toNode) return null;

            const isUserPathEdge = userPath.includes(edge.from) && userPath.includes(edge.to) && Math.abs(userPath.indexOf(edge.from) - userPath.indexOf(edge.to)) === 1;
            const isSolutionPathEdge = animationFrame?.type === 'FINAL_PATH' && animationFrame.path?.includes(edge.from) && animationFrame.path?.includes(edge.to) && Math.abs(animationFrame.path.indexOf(edge.from) - animationFrame.path.indexOf(edge.to)) === 1;
            
            // Calculate midpoint for label
            const midX = (fromNode.x + toNode.x) / 2;
            const midY = (fromNode.y + toNode.y) / 2;
            
            return (
              <g key={`edge-${i}`}>
                <line
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  className={`${styles.edge} ${isUserPathEdge || isSolutionPathEdge ? styles.edgeHighlight : ''}`}
                />
                <text
                  x={midX}
                  y={midY}
                  className={styles.edgeWeight}
                >
                  {edge.weight}
                </text>
              </g>
            );
          })}

          {/* Nodes */}
          {graph.nodes.map(node => {
            const isStart = node.id === startNodeId;
            const isEnd = node.id === endNodeId;
            const isUserPathNode = userPath.includes(node.id);
            const isLastUserNode = userPath[userPath.length - 1] === node.id;

            const isVisitedAnim = animationFrame?.visited?.has(node.id);
            const isCurrentVisitingAnim = animationFrame?.type === 'VISITING' && animationFrame.nodeId === node.id;
            const isSolutionPathNode = animationFrame?.type === 'FINAL_PATH' && animationFrame.path?.includes(node.id);
            const isDragged = draggedNodeId === node.id;

            const nodeClasses = [
              styles.node,
              isStart && styles.startNode,
              isEnd && styles.endNode,
              isUserPathNode && styles.userPathNode,
              isLastUserNode && styles.lastUserNode,
              isVisitedAnim && styles.visitedNodeAnim,
              isCurrentVisitingAnim && styles.visitingNodeAnim,
              isSolutionPathNode && styles.solutionPathNode,
              isDragged && styles.draggingNode,
            ].filter(Boolean).join(' ');

            return (
              <g key={node.id} className={`${styles.nodeGroup} ${isDragged ? styles.dragging : ''}`}>
                <circle 
                  cx={node.x} 
                  cy={node.y} 
                  r={NODE_RADIUS} 
                  className={nodeClasses}
                  onMouseDown={(e) => handleMouseDown(e, node.id)}
                />
                <text x={node.x} y={node.y} className={styles.nodeLabel}>
                  {isStart ? 'START' : isEnd ? 'END' : ''}
                </text>
                {isAnimating && animationFrame?.distance !== undefined && (animationFrame.nodeId === node.id || (animationFrame.visited?.has(node.id) && animationFrame.type !== 'FINAL_PATH')) && (
                  <text x={node.x} y={node.y + NODE_RADIUS + 15} className={styles.distanceLabel}>
                    {animationFrame.distance === Infinity ? '∞' : animationFrame.distance}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className={styles.dialogContent}>
          <DialogHeader className={styles.dialogHeader}>
            <DialogTitle>Dijkstra's Algorithm Visualized</DialogTitle>
            <DialogDescription>
              You just visualized Dijkstra's algorithm, a fundamental tool for finding the shortest path in a graph. I've implemented this and other core algorithms (like BFS, DFS, and dynamic programming) extensively during my competitive programming training.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)} className={styles.dialogButton}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};