import { Painter } from '../Painter';
import { RenderObject } from '../RenderObject';

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
    renderObject: RenderObject,
  ): void {
    const { min, max } = renderObject.getWorldBoundingBox();

    // const points = renderObject.getWorldPoints();
    // if (points.length === 0) {
    //   return;
    // }

    // const [firstPoint, ...restPoints] = points;

    // context.beginPath();
    // context.moveTo(firstPoint.x, firstPoint.y);
    // for (const point of restPoints) {
    //   context.lineTo(point.x, point.y);
    // }
    // context.closePath();

    if (this.fillColor !== null) {
      context.fillStyle = this.fillColor;
      context.fillRect(min.x, min.y, max.x - min.x, max.y - min.y);
    }

    if (this.strokeColor !== null) {
      context.strokeStyle = this.strokeColor;
      context.strokeRect(min.x, min.y, max.x - min.x, max.y - min.y);
    }
  }
}
