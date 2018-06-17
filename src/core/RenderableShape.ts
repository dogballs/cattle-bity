import BoundingBox from './BoundingBox';
import RenderableNode from './RenderableNode';
import Vector from './Vector';

interface IRenderableShapeRenderResult {
  fillColor: string;
  vectors: Vector[];
}

abstract class RenderableShape extends RenderableNode {
  public fillColor: string;
  public vectors: Vector[];

  public getBoundingBox(): BoundingBox {
    const xs = this.vectors.map((v) => v.x);
    const ys = this.vectors.map((v) => v.y);

    const minX = Math.min(...xs);
    const minY = Math.min(...ys);
    const maxX = Math.max(...xs);
    const maxY = Math.max(...ys);

    const min = new Vector(minX, minY).add(this.position);
    const max = new Vector(maxX, maxY).add(this.position);

    return new BoundingBox(min, max);
  }

  public abstract render(): IRenderableShapeRenderResult;
}

export default RenderableShape;
