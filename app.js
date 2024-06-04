export const mazeValues = [
  0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0,
  1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1,
  0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0,
  1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1,
  1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
];

export const mazeWidth = 16;
export const mazeHeight = 16;
/////////

const app = new PIXI.Application();

await app.init({ background: 'lightgrey', height: 600, width: 600 });

document.body.appendChild(app.canvas);

const tileSize = 20;

// Create player sprite
const player = new PIXI.Sprite(PIXI.Texture.WHITE);
player.width = tileSize;
player.height = tileSize;
player.x = tileSize;
player.y = tileSize;
player.tint = 0xff0000;
app.stage.addChild(player);

// Initial tile
app.stage.addChild(new PIXI.Graphics().rect(0, 0, tileSize, tileSize).fill(0x000000));

// Create maze from array
const mazeContainer = new PIXI.Container();
for (let row = 0; row < mazeHeight; row++) {
  const leftWallTile = new PIXI.Graphics().rect(0, row * tileSize + tileSize, tileSize, tileSize).fill(0x000000);
  mazeContainer.addChild(leftWallTile);
  for (let col = 0; col < mazeWidth; col++) {
    const topWallTile = new PIXI.Graphics().rect(col * tileSize + tileSize, 0, tileSize, tileSize).fill(0x000000);
    mazeContainer.addChild(topWallTile);

    const tile = mazeValues[row * mazeWidth + col];
    if (tile === 1) {
      const mazeTile = new PIXI.Graphics().rect(col * tileSize + tileSize, row * tileSize + tileSize, tileSize, tileSize).fill(0x000000);
      mazeContainer.addChild(mazeTile);
    }
  }
}
app.stage.addChild(mazeContainer);

// Create an object to store the state of arrow keys
const keys = {};

// Add event listeners for keydown and keyup events
window.addEventListener('keydown', (e) => (keys[e.code] = true));
window.addEventListener('keyup', (e) => (keys[e.code] = false));

// Update function to move the sprite based on key presses and handle collision
function gameLoop() {
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
  if (canMoveTo(newX, player.y)) player.x = newX;
  if (canMoveTo(player.x, newY)) player.y = newY;
}

// Add the function to the game loop
app.ticker.add(gameLoop);

// ---- Util Functions ------

// Function to check potential collisions with maze walls
function canMoveTo(newX, newY) {
  const potentialBounds = new PIXI.Rectangle(newX, newY, player.width, player.height);
  for (const child of mazeContainer.children) {
    if (child === player) continue;
    if (checkCollision(potentialBounds, child)) {
      return false;
    }
  }
  return true;
}

// Check for collision between two rectangles
function checkCollision(r1, r2) {
  const bounds1 = r1.getBounds();
  const bounds2 = r2.getBounds();
  return (
    bounds1.x < bounds2.x + bounds2.width &&
    bounds1.y < bounds2.y + bounds2.height &&
    bounds2.x < bounds1.x + bounds1.width &&
    bounds2.y < bounds1.y + bounds1.height
  );
}
