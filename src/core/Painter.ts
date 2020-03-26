import { GameObject } from './GameObject';

export abstract class Painter {
  public abstract paint(
    context: CanvasRenderingContext2D,
    gameObject: GameObject, // TODO: circular reference
    offscreenContext?: OffscreenCanvasRenderingContext2D,
  ): void;
}
