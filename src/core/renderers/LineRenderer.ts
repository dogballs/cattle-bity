import { GameObject } from '../GameObject';
import { Vector } from '../Vector';

import { Renderer } from './Renderer';

export class LineRenderer extends Renderer {
  public positions: Vector[] = [];
  public strokeColor = '#000';

  public render(canvas: HTMLCanvasElement, gameObject: GameObject): void {
    if (this.positions.length === 0) {
      return;
    }

    const context = canvas.getContext('2d');

    const { min } = gameObject.getWorldBoundingBox();

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
