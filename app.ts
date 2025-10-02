import { Application, Sprite, Texture } from 'pixi.js';
import { createMaze } from './src/maze';
import { canMoveTo, checkCover, createTile } from './src/utils';
import { lavaContainer, lavaTickerFactory } from './src/lava';
import { LAVA_START_DELAY, MAZE_SIZE, TILE_SIZE } from './src/constants';
import { getGoalTilePosition } from './src/goal';
import { GameInfo, isGameDone } from './src/globals';

async function main() {
  GameInfo.state = 'LOADING';
  const CANVAS_SIZE = MAZE_SIZE * TILE_SIZE;

  // Init app
  const app = new Application();
  await app.init({ background: 'lightgrey', height: CANVAS_SIZE, width: CANVAS_SIZE });
  document.getElementById('canvas-container')?.appendChild(app.canvas);

  const startPosition = { row: 1, col: 1, x: TILE_SIZE, y: TILE_SIZE } as const;

  // Create player sprite
  const player = new Sprite(Texture.WHITE);
  player.width = TILE_SIZE;
  player.height = TILE_SIZE;
  player.x = startPosition.x;
  player.y = startPosition.y;
  player.zIndex = 10;
  player.tint = '#2196F3';
  app.stage.addChild(player);

  // Create maze
  const [mazeContainer, mazeValues] = createMaze(TILE_SIZE);
  app.stage.addChild(mazeContainer);

  // Create goal tile
  const goal = getGoalTilePosition(mazeValues, startPosition);
  // mazeValues[goal.row][goal.col] = GOAL_TILE; // if this is needed, change logic in lava alg. to be if tile is floor or goal
  const goalTile = createTile(goal.row, goal.col, 'green');
  app.stage.addChild(goalTile);

  // Create empty lava container
  app.stage.addChild(lavaContainer);

  // Create an object to store the state of arrow keys
  const keys: any = {};

  // Add event listeners for keydown and keyup events
  window.addEventListener('keydown', (e) => {
    keys[e.code] = true;

    // Start lava
    if (!isGameDone()) {
      GameInfo.state = 'PLAYING';

      setTimeout(() => {
        app.ticker.add(lavaTickerFactory(startPosition, mazeValues, player));
      }, LAVA_START_DELAY);
    }
  });
  window.addEventListener('keyup', (e) => (keys[e.code] = false));

  const speed = 1; // pixels
  const expectedFrameTime = 1000 / 120; // Ideal 120 fps

  // Create game loop
  app.ticker.add((ticker) => {
    let scalingFactor = ticker.deltaMS / expectedFrameTime;
    const playerSpeed = Math.round(speed * scalingFactor);

    let newX = player.x;
    let newY = player.y;

    // Losing state is set in lava.ts
    if (GameInfo.state === 'LOST') {
      player.tint = '#454545ff'; // Player gets burnt
    }

    if (GameInfo.state === 'PLAYING' && checkCover(player, goalTile)) {
      alert('YOU ESCAPED!')
      GameInfo.state = 'WON';
      player.zIndex = -10; // Players gets "teleported"
    }

    if (GameInfo.state === 'PLAYING') {
      if (keys['ArrowUp'] || keys['KeyW']) newY -= playerSpeed;
      if (keys['ArrowDown'] || keys['KeyS']) newY += playerSpeed;
      if (keys['ArrowLeft'] || keys['KeyA']) newX -= playerSpeed;
      if (keys['ArrowRight'] || keys['KeyD']) newX += playerSpeed;

      // Check if there's actually a need to move
      if (newX === player.x && newY === player.y) return;

      // Attempt horizontal movement first, then vertical movement
      if (canMoveTo(newX, player.y, player, mazeContainer)) player.x = newX;
      if (canMoveTo(player.x, newY, player, mazeContainer)) player.y = newY;
    }
  });

  GameInfo.state = 'LOADED';
}

window.onload = function () {
  main();
};
