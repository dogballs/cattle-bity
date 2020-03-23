import { GameLoop } from '../core';

declare global {
  interface Window {
    gameLoop: GameLoop;
  }
}
