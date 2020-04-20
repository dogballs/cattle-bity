import { RenderContext } from '../render';

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

  public paint(context: RenderContext, renderObject: RenderObject): void {
    const box = renderObject.getWorldBoundingBox();
    const rect = box.toRect();

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
      context.fillRect(rect, this.fillColor);
    }

    if (this.strokeColor !== null) {
      context.strokeRect(rect, this.strokeColor);
    }
  }
}
