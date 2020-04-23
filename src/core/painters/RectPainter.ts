import { RenderContext } from '../render';

import { Painter } from '../Painter';
import { RenderObject } from '../RenderObject';

export class RectPainter extends Painter {
  public fillColor: string = null;
  public strokeColor: string = null;
  public lineWidth = 1;

  constructor(fillColor: string = null, strokeColor: string = null) {
    super();

    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
  }

  public paint(context: RenderContext, renderObject: RenderObject): void {
    const box = renderObject.getWorldBoundingBox();
    const rect = box.toRect();

    // Originally canvas draws border outside the rectangle.
    // Recalculate coordinates of the border to be inside rect - it will
    // simplify clearing rect during rendering.
    const x = rect.x + this.lineWidth;
    const y = rect.y + this.lineWidth;
    const width = rect.width - this.lineWidth * 2;
    const height = rect.height - this.lineWidth * 2;

    if (this.fillColor !== null) {
      context.fillRect(rect.x, rect.y, rect.width, rect.height, this.fillColor);
    }

    if (this.strokeColor !== null) {
      context.strokeRect(x, y, width, height, this.strokeColor, this.lineWidth);
    }
  }
}
