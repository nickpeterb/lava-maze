import { Graphics, Container } from 'pixi.js';

export const mazeValues = [
  0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0,
  1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1,
  0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0,
  1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1,
  1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
];

export const mazeWidth = 16;
export const mazeHeight = 16;

/** Create maze from array */
export function generateMaze(tileSize: number) {
  const mazeContainer = new Container();

  // Initial tile
  mazeContainer.addChild(new Graphics().rect(0, 0, tileSize, tileSize).fill(0x000000));

  for (let row = 0; row < mazeHeight; row++) {
    // Add left wall
    const leftWallTile = new Graphics().rect(0, row * tileSize + tileSize, tileSize, tileSize).fill(0x000000);
    mazeContainer.addChild(leftWallTile);

    for (let col = 0; col < mazeWidth; col++) {
      // Add top wall
      const topWallTile = new Graphics().rect(col * tileSize + tileSize, 0, tileSize, tileSize).fill(0x000000);
      mazeContainer.addChild(topWallTile);

      // Add maze tiles
      const tile = mazeValues[row * mazeWidth + col];
      if (tile === 1) {
        const mazeTile = new Graphics().rect(col * tileSize + tileSize, row * tileSize + tileSize, tileSize, tileSize).fill(0x000000);
        mazeContainer.addChild(mazeTile);
      }
    }
  }
  return mazeContainer;
}
