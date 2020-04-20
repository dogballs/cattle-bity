import { ImageSource } from '../../graphics';

import { Rect } from '../../Rect';
import { Vector } from '../../Vector';

import { RenderContext } from '../RenderContext';

export class CanvasRenderContext extends RenderContext {
  private context: NativeContext;

  constructor(canvas: NativeCanvas) {
    super(canvas);

    this.context = canvas.getContext('2d');
  }

  public drawImage(
    imageSource: ImageSource,
    sourceRect: Rect,
    destinationRect: Rect,
  ): void {
    this.context.drawImage(
      imageSource.getElement(),
      sourceRect.x,
      sourceRect.y,
      sourceRect.width,
      sourceRect.height,
      destinationRect.x,
      destinationRect.y,
      destinationRect.width,
      destinationRect.height,
    );
  }

  public clear(): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  public fillRect(rect: Rect, color = '#000'): void {
    this.context.fillStyle = color;
    this.context.fillRect(rect.x, rect.y, rect.width, rect.height);
  }

  public getGlobalAlpha(): number {
    return this.context.globalAlpha;
  }

  public setGlobalAlpha(alpha: number): void {
    this.context.globalAlpha = alpha;
  }

  public resetAlpha(): void {
    this.context.globalAlpha = 1;
  }

  public strokePath(positions: Vector[], color = '#000'): void {
    if (positions.length < 1) {
      return;
    }

    const [firstPosition, ...restPositions] = positions;

    this.context.beginPath();
    this.context.moveTo(firstPosition.x, firstPosition.y);

    for (const position of restPositions) {
      this.context.lineTo(position.x, position.y);
    }

    this.context.closePath();

    this.context.strokeStyle = color;
    this.context.stroke();
  }

  public strokeRect(rect: Rect, color = '#000'): void {
    this.context.strokeStyle = color;
    this.context.strokeRect(rect.x, rect.y, rect.width, rect.height);
  }
}
