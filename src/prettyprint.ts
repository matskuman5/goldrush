import { intToBinaryString, openDirections } from './util';
import { Position } from './types';

export const prettyPrintMaze = (maze: number[][]) => {
  for (let row of maze) {
    console.log(
      row
        .map(intToBinaryString)
        .map(openDirections)
        .map(directionsToBoxDrawings)
        .join(' ')
    );
  }
};

export const prettyPrintSolution = (maze: number[][], solution: Position[]) => {
  for (let i = 0; i < maze.length; i++) {
    let row = '';
    for (let j = 0; j < maze.length; j++) {
      if (solution.some((p) => p.x === i && p.y === j)) {
        row = row.concat('X ');
      } else {
        row = row.concat('  ');
      }
    }
    console.log(row);
  }
};

const directionsToBoxDrawings = (directions: string[]) => {
  if (['N', 'E', 'S', 'W'].every((d) => directions.includes(d))) {
    return '┼';
  } else if (['N', 'E', 'S'].every((d) => directions.includes(d))) {
    return '├';
  } else if (['N', 'E', 'W'].every((d) => directions.includes(d))) {
    return '┴';
  } else if (['N', 'S', 'W'].every((d) => directions.includes(d))) {
    return '┤';
  } else if (['E', 'S', 'W'].every((d) => directions.includes(d))) {
    return '┬';
  } else if (['N', 'E'].every((d) => directions.includes(d))) {
    return '└';
  } else if (['N', 'S'].every((d) => directions.includes(d))) {
    return '│';
  } else if (['N', 'W'].every((d) => directions.includes(d))) {
    return '┘';
  } else if (['E', 'S'].every((d) => directions.includes(d))) {
    return '┌';
  } else if (['E', 'W'].every((d) => directions.includes(d))) {
    return '─';
  } else if (['S', 'W'].every((d) => directions.includes(d))) {
    return '┐';
  } else if (directions.includes('N')) {
    return '╵';
  } else if (directions.includes('E')) {
    return '╶';
  } else if (directions.includes('S')) {
    return '╷';
  } else if (directions.includes('W')) {
    return '╴';
  }
};
