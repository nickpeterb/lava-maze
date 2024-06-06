import { Container, Graphics, Sprite, Ticker } from 'pixi.js';
import { checkCollision } from './utils';
import { FLOOR_TILE, LAVA_SPEED, LAVA_TILE } from './constants';

export const lavaContainer = new Container();

export function lavaTickerFactory(
  startIndexes: { row: number; col: number },
  tileSize: number,
  mazeValues: number[][],
  player: Sprite
) {
  mazeValues = JSON.parse(JSON.stringify(mazeValues));

  const waitTimeMS = LAVA_SPEED;
  let elapsedMS = 0;

  // Array of lava tiles
  const lavaTiles: { row: number; col: number }[] = [{ ...startIndexes }];

  return function lavaTicker(ticker: Ticker) {
    // Delay execution
    elapsedMS += ticker.deltaMS;
    if (elapsedMS < waitTimeMS) return;
    elapsedMS = 0;

    // New lava tiles
    const newTiles: { row: number; col: number }[] = [];
    let allFull = true; // Stop flag
    // For each current lava tile
    for (const tile of lavaTiles) {
      const neighbors = getNeighbors(tile.row, tile.col, mazeValues[0].length);
      // For each neighbor
      for (const neighbor of neighbors) {
        // If empty tile
        if (mazeValues[neighbor.row][neighbor.col] === FLOOR_TILE) {
          allFull = false;

          // Set as lava tile
          mazeValues[neighbor.row][neighbor.col] = LAVA_TILE;
          newTiles.push(neighbor);
          const newLavaTile = new Graphics()
            .rect(neighbor.col * tileSize, neighbor.row * tileSize, tileSize, tileSize)
            .fill('red');
          lavaContainer.addChild(newLavaTile);

          if (checkCollision(player, newLavaTile)) {
            // Could call ticker.stop() here, but looks cool if the lava keeps going
            console.error('Game Over!');
          }
        }
      }
    }
    // Add new lava tiles
    lavaTiles.push(...newTiles);
    // Stop ticker if all tiles are covered
    if (allFull) ticker.stop();
  };
}

function getNeighbors(tileRow: number, tileCol: number, mazeWidth: number) {
  // Sorted by lowest -> highest priority
  return [
    { row: Math.max(0, tileRow - 1), col: tileCol }, // up
    { row: Math.min(mazeWidth, tileRow + 1), col: tileCol }, // down
    { row: tileRow, col: Math.max(0, tileCol - 1) }, // left
    { row: tileRow, col: Math.min(mazeWidth, tileCol + 1) }, // right
  ];
}

/*
Current algorithm: 
1. Create emtpy array of lava tiles
2. Add initial lava tile
3. For each tile in lavaTiles array:
4.     For each neighboring tile:
5.         If empty, add tile to lavaTiles array

The problem with this is that it would be get slower as it goes on, because it's checking
all the neighbors of a bunch of already filled lava tiles
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
  let stack: { row: number; col: number }[] = [];
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
      let currTile = stack.pop() as { row: number; col: number };
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
