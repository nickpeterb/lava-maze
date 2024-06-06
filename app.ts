import { Application, Sprite, Texture } from 'pixi.js';
import { createMaze } from './src/maze';
import { canMoveTo } from './src/utils';
import { lavaContainer, lavaTickerFactory } from './src/lava';
import { LAVA_START_DELAY, TILE_SIZE } from './src/constants';

async function main() {
  // Init app
  const app = new Application();
  await app.init({ background: 'lightgrey', height: window.innerHeight - 5, width: window.innerWidth - 5 });
  document.body.innerHTML = '';
  document.body.appendChild(app.canvas);

  const startPosition = { row: 1, col: 1, x: TILE_SIZE, y: TILE_SIZE } as const;

  // Create player sprite
  const player = new Sprite(Texture.WHITE);
  player.width = TILE_SIZE;
  player.height = TILE_SIZE;
  player.x = startPosition.x;
  player.y = startPosition.y;
  player.tint = '#2196F3';
  app.stage.addChild(player);

  // Create maze
  const [mazeContainer, mazeValues] = createMaze(TILE_SIZE);
  app.stage.addChild(mazeContainer);

  // Create empty lava container
  app.stage.addChild(lavaContainer);

  // Create an object to store the state of arrow keys
  const keys = {};

  let gameStarted = false;

  // Add event listeners for keydown and keyup events
  window.addEventListener('keydown', (e) => {
    keys[e.code] = true;

    // Start lava
    if (!gameStarted) {
      gameStarted = true;
      setTimeout(() => {
        app.ticker.add(lavaTickerFactory(startPosition, TILE_SIZE, mazeValues, player));
      }, LAVA_START_DELAY);
    }
  });
  window.addEventListener('keyup', (e) => (keys[e.code] = false));

  // Create game loop
  app.ticker.add(() => {
    const speed = 1;
    let newX = player.x;
    let newY = player.y;

    if (keys['ArrowUp'] || keys['KeyW']) newY -= speed;
    if (keys['ArrowDown'] || keys['KeyS']) newY += speed;
    if (keys['ArrowLeft'] || keys['KeyA']) newX -= speed;
    if (keys['ArrowRight'] || keys['KeyD']) newX += speed;

    // Check if there's actually a need to move
    if (newX === player.x && newY === player.y) return;

    // Attempt horizontal movement first, then vertical movement
    if (canMoveTo(newX, player.y, player, mazeContainer)) player.x = newX;
    if (canMoveTo(player.x, newY, player, mazeContainer)) player.y = newY;
  });
}

window.onload = function () {
  main();
};
