import { ImageSource } from '../../graphics';

import { Rect } from '../../Rect';
import { Vector } from '../../Vector';

import { RenderContext } from '../RenderContext';

export class CanvasRenderContext extends RenderContext {
  private context: NativeContext;

  public init(): void {
    this.context = this.canvas.getContext('2d');
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

  public clearRect(x: number, y: number, width: number, height: number): void {
    this.context.clearRect(x, y, width, height);
  }

  public fillRect(
    x: number,
    y: number,
    width: number,
    height: number,
    color = '#000',
  ): void {
    this.context.fillStyle = color;
    this.context.fillRect(x, y, width, height);
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

  public strokeRect(
    x: number,
    y: number,
    width: number,
    height: number,
    color = '#000',
    lineWidth = 1,
  ): void {
    this.context.strokeStyle = color;
    this.context.lineWidth = lineWidth;
    this.context.strokeRect(x, y, width, height);
  }
}
