export type GameInstance = {
  gameState: GameState;
  ownerId: string;
  status: string;
  createdAt: string;
  gameType: string;
  entityId: string;
};

export type GameState = {
  player: Player;
  moves: number;
  timer: number;
  start: Position;
  startRotation: number;
  target: Position;
  rows: number;
  columns: number;
  square: number;
  maze: number[][];
};

export type Player = {
  position: Position;
  rotation: number;
};

export type Position = {
  x: number;
  y: number;
};
