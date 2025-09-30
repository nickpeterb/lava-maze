import { GameInfoType } from './types';

export const GameInfo: GameInfoType = {
  state: 'LOADING',
};

export function isGameDone() {
  return GameInfo.state === 'LOST' || GameInfo.state === 'WON';
}
