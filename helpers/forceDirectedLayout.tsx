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

type NodeWithVelocity = Node & {
  vx: number;
  vy: number;
};

const REPULSION_STRENGTH = 5000; // Strength of repulsion between all nodes
const ATTRACTION_STRENGTH = 0.01; // Spring strength for connected nodes
const OPTIMAL_DISTANCE = 150; // Target distance between connected nodes
const ITERATIONS = 250; // Number of simulation iterations
const DAMPING = 0.85; // Velocity damping factor (cooling)
const TIME_STEP = 0.5; // Time step for each iteration

export const applyForceDirectedLayout = (
  nodes: Node[],
  edges: Edge[],
  canvasWidth: number,
  canvasHeight: number,
  padding: number
): Node[] => {
  // Initialize nodes with velocities
  const nodesWithVelocity: NodeWithVelocity[] = nodes.map(node => ({
    ...node,
    vx: 0,
    vy: 0
  }));

  // Build adjacency map for quick neighbor lookup
  const adjacencyMap = new Map<string, Set<string>>();
  edges.forEach(edge => {
    if (!adjacencyMap.has(edge.from)) {
      adjacencyMap.set(edge.from, new Set());
    }
    if (!adjacencyMap.has(edge.to)) {
      adjacencyMap.set(edge.to, new Set());
    }
    adjacencyMap.get(edge.from)!.add(edge.to);
    adjacencyMap.get(edge.to)!.add(edge.from);
  });

  // Run simulation
  for (let iteration = 0; iteration < ITERATIONS; iteration++) {
    // Calculate cooling factor (decreases over time)
    const coolingFactor = 1 - (iteration / ITERATIONS);
    const currentDamping = DAMPING * coolingFactor;

    // Reset forces for this iteration
    const forces: { id: string; fx: number; fy: number }[] = nodesWithVelocity.map(node => ({
      id: node.id,
      fx: 0,
      fy: 0
    }));

    // Calculate repulsion forces (all pairs)
    for (let i = 0; i < nodesWithVelocity.length; i++) {
      for (let j = i + 1; j < nodesWithVelocity.length; j++) {
        const nodeA = nodesWithVelocity[i];
        const nodeB = nodesWithVelocity[j];

        const dx = nodeB.x - nodeA.x;
        const dy = nodeB.y - nodeA.y;
        const distanceSq = dx * dx + dy * dy;
        const distance = Math.sqrt(distanceSq);

        if (distance > 0) {
          // Coulomb's law: F = k / r²
          const repulsionForce = REPULSION_STRENGTH / distanceSq;
          const fx = (dx / distance) * repulsionForce;
          const fy = (dy / distance) * repulsionForce;

          forces[i].fx -= fx;
          forces[i].fy -= fy;
          forces[j].fx += fx;
          forces[j].fy += fy;
        }
      }
    }

    // Calculate attraction forces (connected nodes)
    edges.forEach(edge => {
      const nodeAIndex = nodesWithVelocity.findIndex(n => n.id === edge.from);
      const nodeBIndex = nodesWithVelocity.findIndex(n => n.id === edge.to);

      if (nodeAIndex === -1 || nodeBIndex === -1) return;

      const nodeA = nodesWithVelocity[nodeAIndex];
      const nodeB = nodesWithVelocity[nodeBIndex];

      const dx = nodeB.x - nodeA.x;
      const dy = nodeB.y - nodeA.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 0) {
        // Hooke's law: F = k * (distance - optimal_distance)
        const displacement = distance - OPTIMAL_DISTANCE;
        const attractionForce = ATTRACTION_STRENGTH * displacement;
        const fx = (dx / distance) * attractionForce;
        const fy = (dy / distance) * attractionForce;

        forces[nodeAIndex].fx += fx;
        forces[nodeAIndex].fy += fy;
        forces[nodeBIndex].fx -= fx;
        forces[nodeBIndex].fy -= fy;
      }
    });

    // Apply forces to update velocities and positions
    nodesWithVelocity.forEach((node, i) => {
      // Update velocity
      node.vx = (node.vx + forces[i].fx * TIME_STEP) * currentDamping;
      node.vy = (node.vy + forces[i].fy * TIME_STEP) * currentDamping;

      // Update position
      node.x += node.vx * TIME_STEP;
      node.y += node.vy * TIME_STEP;

      // Keep within bounds
      node.x = Math.max(padding, Math.min(canvasWidth - padding, node.x));
      node.y = Math.max(padding, Math.min(canvasHeight - padding, node.y));
    });
  }

  // Return nodes without velocity properties
  return nodesWithVelocity.map(({ id, x, y }) => ({ id, x, y }));
};