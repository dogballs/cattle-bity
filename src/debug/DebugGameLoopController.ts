import { GameLoop } from '../core';

export class DebugGameLoopController {
  private gameLoop: GameLoop;
  private container: HTMLElement;
  private startButton: HTMLElement;
  private stopButton: HTMLElement;
  private nextFrameButton: HTMLElement;

  constructor(gameLoop: GameLoop) {
    this.gameLoop = gameLoop;

    this.container = document.createElement('div');
    this.container.setAttribute(
      'style',
      'background: white; position: absolute; right: 0; padding: 10px; display: flex; flex-direction: column',
    );

    const title = document.createElement('div');
    title.textContent = 'Game loop';
    this.container.appendChild(title);

    this.startButton = document.createElement('button');
    this.startButton.textContent = 'Start';
    this.startButton.addEventListener('click', this.handleStart);
    this.container.appendChild(this.startButton);

    this.stopButton = document.createElement('button');
    this.stopButton.textContent = 'Stop';
    this.stopButton.addEventListener('click', this.handleStop);
    this.container.appendChild(this.stopButton);

    this.nextFrameButton = document.createElement('button');
    this.nextFrameButton.textContent = 'Next frame';
    this.nextFrameButton.addEventListener('click', this.handleNextFrame);
    this.container.appendChild(this.nextFrameButton);
  }

  public getElement(): HTMLElement {
    return this.container;
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
}
