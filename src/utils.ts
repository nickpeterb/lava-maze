import { Container, Rectangle, Sprite } from 'pixi.js';

/** Checks for potential collisions with maze walls */
export function canMoveTo(newX: number, newY: number, player: Sprite, maze: Container) {
  const potentialBounds = new Rectangle(newX, newY, player.width, player.height);
  for (const child of maze.children) {
    if (child === player) continue;
    if (checkCollision(potentialBounds, child)) {
      return false;
    }
  }
  return true;
}

/** Checks for collision between two rectangles */
export function checkCollision(r1, r2) {
  const bounds1 = r1.getBounds();
  const bounds2 = r2.getBounds();
  return (
    bounds1.x < bounds2.x + bounds2.width &&
    bounds1.y < bounds2.y + bounds2.height &&
    bounds2.x < bounds1.x + bounds1.width &&
    bounds2.y < bounds1.y + bounds1.height
  );
}
