import { Graphics, Container } from 'pixi.js';

/** Create maze from array */
export function generateMaze(tileSize: number): [Container, number[][]] {
  const mazeWidth = 17;
  const mazeHeight = 17;
  const mazeValues: number[][] = generateMazeArray(mazeHeight, mazeWidth);

  // Draw maze
  const mazeContainer = new Container();
  for (let row = 0; row < mazeHeight; row++) {
    for (let col = 0; col < mazeWidth; col++) {
      if (mazeValues[row][col] === 1) {
        const mazeTile = new Graphics().rect(col * tileSize, row * tileSize, tileSize, tileSize).fill('black');
        mazeContainer.addChild(mazeTile);
      }
    }
  }
  return [mazeContainer, mazeValues];
}

function generateMazeArray(mazeHeight: number, mazeWidth: number) {
  // Will be randomly generated
  const generatedValues = [
    0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0,
    0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1,
    0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0,
    1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1,
    1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0,
    1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  ];

  // Transform to 2D array, and add in top and lefthand walls
  const mazeValues: number[][] = [];
  for (let row = 0; row < mazeHeight - 1; row++) {
    mazeValues.push([1]);
    for (let col = 0; col < mazeWidth - 1; col++) {
      const tile = generatedValues[row * (mazeWidth - 1) + col];
      mazeValues[row].push(tile);
    }
  }
  mazeValues.unshift([...Array(mazeWidth + 1).keys()].map(() => 1));

  return mazeValues;
}
