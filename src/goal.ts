import { FLOOR_TILE, MAZE_SIZE } from './constants';
import { Tile } from './types';
import { getTileNeighbors } from './utils';

export function getGoalTilePosition(mazeValues: number[][], start: { row: number; col: number }): Tile {
  // Create queue of tiles to visit
  const tilesQueue: Tile[] = [{ ...start }];
  // Create distances matrix filled with -1
  const distances: number[][] = Array.from({ length: MAZE_SIZE }, () => Array(MAZE_SIZE).fill(-1));
  distances[start.row][start.col] = 0;

  let furthestTile: Tile = { ...start };
  let maxDistance: number = 0;

  while (tilesQueue.length > 0) {
    const tile = tilesQueue.shift();
    const tileDistance = distances[tile.row][tile.col];

    const neighbors = getTileNeighbors(tile.row, tile.col, MAZE_SIZE);
    for (const { row, col } of neighbors) {
      const isVisited = distances[row][col] > -1;
      const isFloor = mazeValues[row][col] === FLOOR_TILE;

      if (isFloor && !isVisited) {
        // Add to queue
        tilesQueue.push({ row, col });
        // Update distances matrix
        distances[row][col] = tileDistance + 1;
        // Update furthest point
        if (distances[row][col] > maxDistance) {
          maxDistance = distances[row][col];
          furthestTile = { row, col };
        }
      }
    }
  }

  return furthestTile;
}
