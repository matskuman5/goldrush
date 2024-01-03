import 'dotenv/config';
import open from 'open';
import WebSocket from 'ws';
import { Position } from './types';
import { aStar, createGraph, pathToDirections } from './astar';

const playerToken = process.env.PLAYER_TOKEN || 'null';
const levelId = process.env.LEVEL_ID || 'null';

const prettyPrintMaze = (maze: number[][]) => {
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

const prettyPrintSolution = (maze: number[][], solution: Position[]) => {
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

const runApp = async () => {
  console.log('Player token: ', playerToken);
  console.log('Level ID: ', playerToken);

  const headers = new Headers();
  headers.append('Authorization', playerToken);

  const response = await fetch(
    `https://goldrush.monad.fi/backend/api/levels/${levelId}`,
    { method: 'POST', headers }
  );

  const game = await response.json();

  const gameState = JSON.parse(game.gameState);

  console.log('Maze:');
  prettyPrintMaze(gameState.maze);

  console.log('Start: ', gameState.start);

  const fixedTarget = {
    x: gameState.target.y,
    y: gameState.target.x,
  }; // For some reason, the target is flipped somewhere

  console.log('Target: ', fixedTarget);

  const graph = createGraph(gameState.maze);
  const solution = aStar(graph, gameState.start, fixedTarget);

  if (!solution) {
    console.log('No solution found!');
    return;
  }

  console.log('Solution:');
  prettyPrintSolution(gameState.maze, solution);

  const moves = pathToDirections(solution);
  console.log(moves);

  const ws = new WebSocket(`wss://goldrush.monad.fi/backend/${playerToken}/`);

  ws.on('open', async () => {
    console.log('Websocket opened!');
    ws.send(JSON.stringify(['sub-game', { id: game.entityId }]));

    open(`https://goldrush.monad.fi/?id=${game.entityId}`);

    await new Promise((resolve) => setTimeout(resolve, 3000));

    const firstMove = moves[0];
    ws.send(
      JSON.stringify([
        'run-command',
        {
          gameId: game.entityId,
          payload: {
            action: 'rotate',
            rotation: directionToRotation(firstMove),
          },
        },
      ])
    ); // First, turn to the correct direction

    console.log('Sent first rotation: ', firstMove);

    let previousMove = firstMove;

    while (true) {
      await new Promise((resolve) => setTimeout(resolve, 100));

      const move = moves.shift();

      if (!move) {
        console.log('No more moves!');
        break;
      }

      if (move === previousMove) {
        console.log('Moving forward: ', move);
        ws.send(
          JSON.stringify([
            'run-command',
            { gameId: game.entityId, payload: { action: 'move' } },
          ])
        ); // If we are moving in the same direction as before, just move
      } else {
        console.log('Turning in direction: ', move);
        ws.send(
          JSON.stringify([
            'run-command',
            {
              gameId: game.entityId,
              payload: {
                action: 'rotate',
                rotation: directionToRotation(move),
              },
            },
          ])
        );
        moves.unshift(move); // Otherwise, turn to the correct direction and add the move back to the queue
      }
      previousMove = move;
    }
  });
};

const directionToRotation = (direction: string) => {
  switch (direction) {
    case 'N':
      return 0;
    case 'E':
      return 90;
    case 'S':
      return 180;
    case 'W':
      return 270;
  }
};

export const intToBinaryString = (n: number) => {
  return n.toString(2).padStart(4, '0');
};

export const openDirections = (bitString: string) => {
  const directions: string[] = [];

  if (bitString.charAt(0) === '0') {
    directions.push('N');
  }
  if (bitString.charAt(1) === '0') {
    directions.push('E');
  }
  if (bitString.charAt(2) === '0') {
    directions.push('S');
  }
  if (bitString.charAt(3) === '0') {
    directions.push('W');
  }

  return directions;
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

runApp();
