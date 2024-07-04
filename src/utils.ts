import { Container, Graphics, Rectangle, Sprite } from 'pixi.js';
import { TILE_SIZE } from './constants';
import { Tile } from './types';

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

/** Creates a Pixi.js Graphics object for a maze tile */
export function createTile(row: number, col: number, color: string) {
  return new Graphics().rect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE).fill(color);
}

/** Return all the neighbors of a given maze tile */
export function getTileNeighbors(tileRow: number, tileCol: number, mazeWidth: number): Tile[] {
  return [
    { row: Math.max(0, tileRow - 1), col: tileCol }, // up
    { row: Math.min(mazeWidth, tileRow + 1), col: tileCol }, // down
    { row: tileRow, col: Math.max(0, tileCol - 1) }, // left
    { row: tileRow, col: Math.min(mazeWidth, tileCol + 1) }, // right
  ];
}
