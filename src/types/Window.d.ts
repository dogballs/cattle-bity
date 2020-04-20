import { GameLoop } from '../core';

declare global {
  interface Window {
    gameLoop: GameLoop;
  }

  type NativeCanvas = HTMLCanvasElement | OffscreenCanvas;

  type NativeContext =
    | CanvasRenderingContext2D
    | OffscreenCanvasRenderingContext2D;
}
