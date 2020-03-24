import { GameObject } from './GameObject';

export abstract class Painter {
  public abstract paint(
    canvas: HTMLCanvasElement,
    gameObject: GameObject, // TODO: circular reference
    offscreenCanvas?: OffscreenCanvas,
  ): void;
}
