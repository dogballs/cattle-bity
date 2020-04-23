import { ImageSource } from '../graphics';

import { Rect } from '../Rect';
import { Vector } from '../Vector';

type Canvas = HTMLCanvasElement | OffscreenCanvas;

export abstract class RenderContext {
  protected canvas: Canvas;

  constructor(canvas: Canvas) {
    this.canvas = canvas;
  }

  abstract init(): void;
  abstract clear(): void;
  abstract clearRect(x: number, y: number, width: number, height: number): void;
  abstract drawImage(
    imageSource: ImageSource,
    sourceRect: Rect,
    destinationRect: Rect,
  );
  abstract fillRect(
    x: number,
    y: number,
    width: number,
    height: number,
    color: string,
  );
  abstract getGlobalAlpha(): number;
  abstract setGlobalAlpha(alpha: number);
  abstract strokePath(positions: Vector[], color: string);
  abstract strokeRect(
    x: number,
    y: number,
    width: number,
    height: number,
    color?: string,
    lineWidth?: number,
  );
}
