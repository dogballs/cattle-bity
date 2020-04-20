import { RenderObject } from './RenderObject';
import { RenderContext } from './render';

export abstract class Painter {
  public abstract paint(
    context: RenderContext,
    renderObject: RenderObject, // TODO: circular reference
  ): void;
}
