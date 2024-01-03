import { intToBinaryString, openDirections } from '.';
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
