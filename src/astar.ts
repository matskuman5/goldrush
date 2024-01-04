import { intToBinaryString, openDirections } from './util';
import { Position } from './types';

type Node = {
  position: Position;
  neighbors: Position[];
};

export const createGraph = (maze: number[][]) => {
  const graph: Node[] = [];

  for (let i = 0; i < maze.length; i++) {
    for (let j = 0; j < maze.length; j++) {
      graph.push({
        position: { x: i, y: j },
        neighbors: openDirectionsToNeighbors(
          { x: i, y: j },
          openDirections(intToBinaryString(maze[i][j]))
        ),
      });
    }
  }
  return graph;
};

const openDirectionsToNeighbors = (
  position: Position,
  directions: string[]
) => {
  const neighbors: Position[] = [];
  if (directions.includes('N')) {
    neighbors.push({ x: position.x - 1, y: position.y });
  }
  if (directions.includes('E')) {
    neighbors.push({ x: position.x, y: position.y + 1 });
  }
  if (directions.includes('S')) {
    neighbors.push({ x: position.x + 1, y: position.y });
  }
  if (directions.includes('W')) {
    neighbors.push({ x: position.x, y: position.y - 1 });
  }
  return neighbors;
};

// A* search algorithm
export const aStar = (graph: Node[], start: Position, goal: Position) => {
  const openSet: Position[] = [start];
  const cameFrom: { [key: string]: Position | null } = {};
  const gScore: { [key: string]: number } = {};
  const fScore: { [key: string]: number } = {};

  // Initialize scores
  graph.forEach((node) => {
    const key = `${node.position.x},${node.position.y}`;
    gScore[key] = Infinity;
    fScore[key] = Infinity;
  });

  gScore[`${start.x},${start.y}`] = 0;
  fScore[`${start.x},${start.y}`] = heuristic(start, goal);

  while (openSet.length > 0) {
    const current = getLowestFScoreNode(openSet, fScore);
    if (current.x === goal.x && current.y === goal.y) {
      return reconstructPath(cameFrom, current);
    }

    openSet.splice(openSet.indexOf(current), 1);

    const neighbors = getNeighbors(graph, current);
    neighbors.forEach((neighbor) => {
      const tentativeGScore = gScore[`${current.x},${current.y}`] + 1;
      if (tentativeGScore < gScore[`${neighbor.x},${neighbor.y}`]) {
        cameFrom[`${neighbor.x},${neighbor.y}`] = current;
        gScore[`${neighbor.x},${neighbor.y}`] = tentativeGScore;
        fScore[`${neighbor.x},${neighbor.y}`] =
          gScore[`${neighbor.x},${neighbor.y}`] + heuristic(neighbor, goal);

        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        }
      }
    });
  }

  return null; // No path found
};

const heuristic = (a: Position, b: Position) => {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
};

const getLowestFScoreNode = (
  nodes: Position[],
  fScore: { [key: string]: number }
) => {
  let lowestFScore = Infinity;
  let lowestNode: Position | null = null;

  nodes.forEach((node) => {
    const fScoreKey = `${node.x},${node.y}`;
    if (fScore[fScoreKey] < lowestFScore) {
      lowestFScore = fScore[fScoreKey];
      lowestNode = node;
    }
  });

  return lowestNode!;
};

const getNeighbors = (graph: Node[], position: Position) => {
  const node = graph.find(
    (n) => n.position.x === position.x && n.position.y === position.y
  );
  return node ? node.neighbors : [];
};

const reconstructPath = (
  cameFrom: { [key: string]: Position | null },
  current: Position
) => {
  const path: Position[] = [current];
  let node = cameFrom[`${current.x},${current.y}`];

  while (node) {
    path.unshift(node);
    node = cameFrom[`${node.x},${node.y}`];
  }

  return path;
};

export const pathToDirections = (path: Position[]) => {
  const directions: string[] = [];

  for (let i = 0; i < path.length - 1; i++) {
    if (path[i].x < path[i + 1].x) {
      directions.push('S');
    } else if (path[i].x > path[i + 1].x) {
      directions.push('N');
    } else if (path[i].y < path[i + 1].y) {
      directions.push('E');
    } else if (path[i].y > path[i + 1].y) {
      directions.push('W');
    }
  }

  return directions;
};

// Reduces the amount of moves by combining moves to move diagonally when possible
export const optimizeDirections = (directions: string[]) => {
  const optimizedDirections: string[] = [];

  let i = 0;
  while (i < directions.length - 1) {
    const currentDirection = directions[i];
    const nextDirection = directions[i + 1];
    if (currentDirection === 'N' && nextDirection === 'E') {
      optimizedDirections.push('NE');
    } else if (currentDirection === 'E' && nextDirection === 'N') {
      optimizedDirections.push('NE');
    } else if (currentDirection === 'S' && nextDirection === 'E') {
      optimizedDirections.push('SE');
    } else if (currentDirection === 'E' && nextDirection === 'S') {
      optimizedDirections.push('SE');
    } else if (currentDirection === 'S' && nextDirection === 'W') {
      optimizedDirections.push('SW');
    } else if (currentDirection === 'W' && nextDirection === 'S') {
      optimizedDirections.push('SW');
    } else if (currentDirection === 'N' && nextDirection === 'W') {
      optimizedDirections.push('NW');
    } else if (currentDirection === 'W' && nextDirection === 'N') {
      optimizedDirections.push('NW');
    } else {
      if (i === directions.length - 2) {
        optimizedDirections.push(currentDirection);
      }
      optimizedDirections.push(currentDirection);
      i++;
      continue;
    }
    if (i === directions.length - 3) {
      i++;
    } else {
      i += 2;
    }
  }

  for (let i = 0; i < directions.length - 1; i += 2) {}

  return optimizedDirections;
};
