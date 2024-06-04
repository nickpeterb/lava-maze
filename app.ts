import { Application, Sprite, Texture } from 'pixi.js';
import { generateMaze } from './src/maze';
import { canMoveTo } from './src/utils';

(async function () {
  // Init app
  const app = new Application();
  await app.init({ background: 'lightgrey', height: 600, width: 600 });
  document.body.appendChild(app.canvas);

  // Define tile size
  const tileSize = 20;

  // Create player sprite
  const player = new Sprite(Texture.WHITE);
  player.width = tileSize;
  player.height = tileSize;
  player.x = tileSize;
  player.y = tileSize;
  player.tint = 0xff0000;
  app.stage.addChild(player);

  // Create maze
  const mazeContainer = generateMaze(tileSize);
  app.stage.addChild(mazeContainer);

  // Create an object to store the state of arrow keys
  const keys = {};

  // Add event listeners for keydown and keyup events
  window.addEventListener('keydown', (e) => (keys[e.code] = true));
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
})();
