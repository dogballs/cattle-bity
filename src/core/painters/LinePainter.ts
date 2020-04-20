import { RenderContext } from '../render';

import { Painter } from '../Painter';
import { RenderObject } from '../RenderObject';
import { Vector } from '../Vector';

export class LinePainter extends Painter {
  public positions: Vector[] = [];
  public strokeColor = '#000';

  public paint(context: RenderContext, renderObject: RenderObject): void {
    if (this.positions.length === 0) {
      return;
    }

    const { min } = renderObject.getWorldBoundingBox();

    const worldPositions = this.positions.map((position) => {
      return position.clone().add(min);
    });

    context.strokePath(worldPositions, this.strokeColor);
  }
}
