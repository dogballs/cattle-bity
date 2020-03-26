import { GameObject } from '../GameObject';
import { Painter } from '../Painter';

export class RectPainter extends Painter {
  public fillColor: string = null;
  public strokeColor: string = null;

  constructor(fillColor: string = null, strokeColor: string = null) {
    super();

    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
  }

  public paint(
    context: CanvasRenderingContext2D,
    gameObject: GameObject,
  ): void {
    // const { min, max } = gameObject.getWorldBoundingBox();

    const points = gameObject.getWorldPoints();
    if (points.length === 0) {
      return;
    }

    const [firstPoint, ...restPoints] = points;

    context.beginPath();
    context.moveTo(firstPoint.x, firstPoint.y);
    for (const point of restPoints) {
      context.lineTo(point.x, point.y);
    }
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
