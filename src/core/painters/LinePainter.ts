import { Painter } from '../Painter';
import { RenderObject } from '../RenderObject';
import { Vector } from '../Vector';

export class LinePainter extends Painter {
  public positions: Vector[] = [];
  public strokeColor = '#000';

  public paint(
    context: CanvasRenderingContext2D,
    renderObject: RenderObject,
  ): void {
    if (this.positions.length === 0) {
      return;
    }

    const { min } = renderObject.getWorldBoundingBox();

    const [firstPosition, ...restPositions] = this.positions;

    const firstPositionWorld = firstPosition.clone().add(min);

    context.beginPath();

    context.moveTo(firstPositionWorld.x, firstPositionWorld.y);

    restPositions.forEach((position) => {
      const positionWorld = position.clone().add(min);

      context.lineTo(positionWorld.x, positionWorld.y);
    });

    context.closePath();

    context.strokeStyle = this.strokeColor;
    context.stroke();
  }
}
