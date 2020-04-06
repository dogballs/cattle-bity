import { RenderObject } from './RenderObject';

export abstract class Painter {
  public abstract paint(
    context: CanvasRenderingContext2D,
    renderObject: RenderObject, // TODO: circular reference
    offscreenContext?: OffscreenCanvasRenderingContext2D,
  ): void;
}
