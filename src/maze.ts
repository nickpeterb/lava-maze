import { Graphics, Container } from 'pixi.js';
import { FLOOR_TILE, MAZE_SIZE, WALL_TILE } from './constants';
const { abs, floor, random } = Math;

/** Create maze from array */
export function createMaze(tileSize: number): [Container, number[][]] {
  const mazeValues: number[][] = generateMazeArray(MAZE_SIZE);

  // Draw maze
  const mazeContainer = new Container();
  for (let row = 0; row < MAZE_SIZE; row++) {
    for (let col = 0; col < MAZE_SIZE; col++) {
      if (mazeValues[row][col] === WALL_TILE) {
        const mazeTile = new Graphics().rect(col * tileSize, row * tileSize, tileSize, tileSize).fill('black');
        mazeContainer.addChild(mazeTile);
      }
    }
  }
  return [mazeContainer, mazeValues];
}

function generateMazeArray(size: number) {
  const world = {
    width: size,
    height: size,
    tiles: new Array(size * size).fill(WALL_TILE) as number[],
  };

  // Generate 1D array
  const nodes = cells(world).filter((cell) => cell.x % 2 && cell.y % 2);
  const maze = generate(nodes, adjacent, choose);
  connect(maze, world);

  // Transform to 2D array, and add in top and lefthand walls
  const mazeValues: number[][] = [];
  for (let row = 0; row < size; row++) {
    mazeValues.push([]);
    for (let col = 0; col < size; col++) {
      const tile = world.tiles[row * size + col];
      mazeValues[row].push(tile);
    }
  }

  return mazeValues;
}

/**
 * Maze generator from https://github.com/semibran/maze/
 * @param nodes A list of nodes to connect
 * @param adjacent A function of the form adjacent(a, b) which determines if node a and node b can be connected
 * @param choose A function of the form choose(array) which chooses a random item from array
 * @returns maze
 */
function generate(nodes, adjacent, choose) {
  let node = choose(nodes);
  const stack = [node];
  const maze = new Map();
  for (let node of nodes) {
    maze.set(node, []);
  }
  while (node) {
    let neighbors = nodes.filter((other) => !maze.get(other).length && adjacent(node, other));
    if (neighbors.length) {
      let neighbor = choose(neighbors);
      maze.get(node).push(neighbor);
      maze.get(neighbor).push(node);
      stack.unshift(neighbor);
      node = neighbor;
    } else {
      stack.shift();
      node = stack[0];
    }
  }
  return maze;
}

// --- Maze Utils ---

function cells(grid) {
  const { width, height } = grid;
  const cells = new Array(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let cell = { x, y };
      cells[locate(grid, cell)] = cell;
    }
  }
  return cells;
}

/** Carve a path into an empty maze */
function connect(maze, world) {
  for (const [node, neighbors] of maze) {
    world.tiles[locate(world, node)] = FLOOR_TILE;
    for (let neighbor of neighbors) {
      let midpoint = {
        x: node.x + (neighbor.x - node.x) / 2,
        y: node.y + (neighbor.y - node.y) / 2,
      };
      world.tiles[locate(world, midpoint)] = FLOOR_TILE;
    }
  }
}

/** Locate a cell within a 1D array given its x and y positions */
function locate(grid, cell) {
  return cell.y * grid.width + cell.x;
}

/** Determine if two cells are adjacent */
function adjacent(a, b) {
  return abs(b.x - a.x) + abs(b.y - a.y) === 2;
}

/** Choose a random element from an array */
function choose(array) {
  return array[floor(random() * array.length)];
}
