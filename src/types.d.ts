export interface Tile {
  row: number;
  col: number;
}

export type GameStateType = 'LOADING' | 'LOADED' | 'PLAYING' | 'WON' | 'LOST';

export interface GameInfoType {
  state: GameStateType;
}
