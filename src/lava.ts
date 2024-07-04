import { Container, Sprite, Ticker } from 'pixi.js';
import { checkCollision, createTile, getTileNeighbors } from './utils';
import { FLOOR_TILE, LAVA_SPEED_DELAY, LAVA_TILE } from './constants';
import { PlayerSettings, Tile } from './types';

export const lavaContainer = new Container();

export function lavaTickerFactory(
  startPosition: Tile,
  mazeValues: number[][],
  player: Sprite,
  playerSettings: PlayerSettings
) {
  mazeValues = JSON.parse(JSON.stringify(mazeValues));
  let elapsedMS = 0;

  // Array of upcoming lava tiles
  let lavaTiles: Tile[] = [{ ...startPosition }];

  return function lavaTicker(ticker: Ticker) {
    // Delay execution
    elapsedMS += ticker.deltaMS;
    if (elapsedMS < LAVA_SPEED_DELAY) return;
    elapsedMS = 0;

    const nextTiles: Tile[] = [];

    for (const tile of lavaTiles) {
      // Turn to lava
      mazeValues[tile.row][tile.col] = LAVA_TILE;
      const newLavaTile = createTile(tile.row, tile.col, 'red');
      lavaContainer.addChild(newLavaTile);

      // Add to next round of lavaTiles
      const neighbors = getTileNeighbors(tile.row, tile.col, mazeValues[0].length);
      const floorNeighbors = neighbors.filter(({ row, col }) => mazeValues[row][col] === FLOOR_TILE);
      nextTiles.push(...floorNeighbors);

      // Check game over
      if (checkCollision(player, newLavaTile)) {
        console.error('Game Over!');
        playerSettings.canMove = false;
      }
    }

    // Reset lavaTiles
    lavaTiles = nextTiles;
    // Stop ticker if all tiles are covered with lava
    if (nextTiles.length === 0) ticker.stop();
  };
}

/*
Lava Algorithm:

For each tile in lavaTiles:
  Turn to lava
  Get neighbors
  For each neighbor:
    If floor tile:
      Add to nextTiles
lavaTiles = nextTiles

*/

/*
Flood-fill (node):
  1. Set Q to the empty queue or stack.
  2. Add node to the end of Q.
  3. While Q is not empty:
  4.   Set n equal to the first element of Q.
  5.   Remove first element from Q.
  6.   If n is Inside:
         Set the n
         Add the node to the west of n to the end of Q.
         Add the node to the east of n to the end of Q.
         Add the node to the north of n to the end of Q.
         Add the node to the south of n to the end of Q.
  7. Continue looping until Q is exhausted.
  8. Return.

// Flood fill agorithm approach
export function lavaTickerFactory(startPosition: { x: number; y: number }, tileSize: number, mazeValues: number[][]) {
  mazeValues = JSON.parse(JSON.stringify(mazeValues));

  const waitTimeMS = 100;
  let elapsedMS = 0;

  // 1. Create stack
  let stack: Tile [] = [];
  // 2. Add empty start tile to stack
  stack.push({ row: 1, col: 1 });

  return function lavaTicker(ticker: Ticker) {
    // Delay execution
    elapsedMS += ticker.deltaMS;
    if (elapsedMS < waitTimeMS) return;
    elapsedMS = 0;

    // 3. While stack is not empty
    if (stack.length > 0) {
      // 4. Set currTile equal to first element of stack
      // 5. Remove first element from set
      let currTile = stack.pop() as Tile ;
      // 6. If currTile is empty
      if (mazeValues[currTile.row][currTile.col] === 0) {
        // Set tile to lava tile
        mazeValues[currTile.row][currTile.col] = 2; // 2 will denote lava
        lavaContainer.addChild(
          new Graphics().rect(currTile.col * tileSize, currTile.row * tileSize, tileSize, tileSize).fill('red')
        );

        // Add neighbors to stack
        const neighbors = getNeighbors(currTile.row, currTile.col, mazeValues[0].length);
        stack.push(...neighbors);
      }
    } else ticker.stop();
  };
}
*/
