import { GameLoop } from '../../core';

import { DebugMenu, DebugMenuOptions } from '../DebugMenu';

export class DebugGameLoopMenu extends DebugMenu {
  private gameLoop: GameLoop;

  constructor(gameLoop: GameLoop, options: DebugMenuOptions = {}) {
    super('Game loop', options);

    this.gameLoop = gameLoop;

    this.appendButton('Start', this.handleStart);
    this.appendButton('Stop', this.handleStop);
    this.appendButton('Next frame', this.handleNextFrame);
    this.appendButton('Next 10 frames', this.handleNextFrame10);
  }

  private handleStart = (): void => {
    this.gameLoop.start();
  };

  private handleStop = (): void => {
    this.gameLoop.stop();
  };

  private handleNextFrame = (): void => {
    this.gameLoop.next();
  };

  private handleNextFrame10 = (): void => {
    this.gameLoop.next(10);
  };
}
