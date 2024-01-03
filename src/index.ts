import 'dotenv/config';
import WebSocket from 'ws';
import { GameInstance } from './types';

const playerToken = process.env.PLAYER_TOKEN || 'null';
const levelId = process.env.LEVEL_ID || 'null';

const runApp = async () => {
  console.log('Player token: ', playerToken);
  console.log('Level ID: ', playerToken);

  const headers = new Headers();
  headers.append('Authorization', playerToken);

  const response = await fetch(
    `https://goldrush.monad.fi/backend/api/levels/${levelId}`,
    { method: 'POST', headers }
  );

  const game = (await response.json()) as GameInstance;

  const ws = new WebSocket(`wss://goldrush.monad.fi/backend/${playerToken}/`);

  ws.on('open', () => {
    console.log('Websocket opened!');
    ws.send(JSON.stringify(['sub-game', { id: game.entityId }]));
  });
};

runApp();
