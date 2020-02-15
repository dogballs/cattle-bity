import { GameObject } from '../GameObject';

import { Renderer } from './Renderer';

export class RectRenderer extends Renderer {
  public fillColor: string = null;
  public strokeColor: string = null;

  constructor(fillColor: string = null, strokeColor: string = null) {
    super();

    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
  }

  public render(canvas: HTMLCanvasElement, gameObject: GameObject): void {
    const context = canvas.getContext('2d');

    const { min, max } = gameObject.getWorldBoundingBox();

    context.beginPath();
    context.moveTo(min.x, min.y);
    context.lineTo(max.x, min.y);
    context.lineTo(max.x, max.y);
    context.lineTo(min.x, max.y);
    context.lineTo(min.x, min.y);
    context.closePath();

    if (this.fillColor !== null) {
      context.fillStyle = this.fillColor;
      context.fill();
    }

    if (this.strokeColor !== null) {
      context.strokeStyle = this.strokeColor;
      context.stroke();
    }
  }
}
