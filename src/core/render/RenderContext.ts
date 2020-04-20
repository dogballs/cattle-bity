import { ImageSource } from '../graphics';

import { Rect } from '../Rect';
import { Vector } from '../Vector';

type Canvas = HTMLCanvasElement | OffscreenCanvas;

export abstract class RenderContext {
  protected canvas: Canvas;

  constructor(canvas: Canvas) {
    this.canvas = canvas;
  }

  abstract clear(): void;
  abstract drawImage(
    imageSource: ImageSource,
    sourceRect: Rect,
    destinationRect: Rect,
  );
  abstract fillRect(rect: Rect, color: string);
  abstract getGlobalAlpha(): number;
  abstract setGlobalAlpha(alpha: number);
  abstract strokePath(positions: Vector[], color: string);
  abstract strokeRect(rect: Rect, color: string);
}
