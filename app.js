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
for (let row = 0; row < mazeHeight; row++) {
  const leftWallTile = new PIXI.Graphics().rect(0, row * tileSize + tileSize, tileSize, tileSize).fill(0x000000);
  app.stage.addChild(leftWallTile);
  for (let col = 0; col < mazeWidth; col++) {
    const topWallTile = new PIXI.Graphics().rect(col * tileSize + tileSize, 0, tileSize, tileSize).fill(0x000000);
    app.stage.addChild(topWallTile);

    const tile = mazeValues[row * mazeWidth + col];
    if (tile === 1) {
      const mazeTile = new PIXI.Graphics().rect(col * tileSize + tileSize, row * tileSize + tileSize, tileSize, tileSize).fill(0x000000);
      app.stage.addChild(mazeTile);
    }
  }
}

// Create an object to store the state of arrow keys
const keys = {};

// Add event listeners for keydown and keyup events
window.addEventListener('keydown', (e) => {
  keys[e.code] = true;
});

window.addEventListener('keyup', (e) => {
  keys[e.code] = false;
});

// Update function to move the sprite based on key presses and handle collision
function gameLoop() {
  const speed = 2.5;
  let newX = player.x;
  let newY = player.y;

  if (keys['ArrowUp']) newY -= speed;
  if (keys['ArrowDown']) newY += speed;
  if (keys['ArrowLeft']) newX -= speed;
  if (keys['ArrowRight']) newX += speed;

  // Check if there's actually a need to move
  if (newX === player.x && newY === player.y) return;

  // Create rectangles to represent the new positions
  const potentialXBounds = new PIXI.Rectangle(newX, player.y, player.width, player.height);
  const potentialYBounds = new PIXI.Rectangle(player.x, newY, player.width, player.height);

  let canMoveX = true;
  let canMoveY = true;

  // Check for potential collisions with all children
  app.stage.children.forEach((child) => {
    if (child !== player) {
      if (hitTestRectangle(potentialXBounds, child)) canMoveX = false;
      if (hitTestRectangle(potentialYBounds, child)) canMoveY = false;
    }
  });

  // Update position only if no collision
  if (canMoveX) player.x = newX;
  if (canMoveY) player.y = newY;
}

// Add the function to the game loop
app.ticker.add(gameLoop);

// Check for collision between two rectangles
function hitTestRectangle(r1, r2) {
  const r1Bounds = r1.getBounds();
  const r2Bounds = r2.getBounds();
  return (
    r1Bounds.x < r2Bounds.x + r2Bounds.width &&
    r1Bounds.x + r1Bounds.width > r2Bounds.x &&
    r1Bounds.y < r2Bounds.y + r2Bounds.height &&
    r1Bounds.y + r1Bounds.height > r2Bounds.y
  );
}
