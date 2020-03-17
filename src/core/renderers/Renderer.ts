import { GameObject } from '../GameObject';

export abstract class Renderer {
  public abstract render(
    canvas: HTMLCanvasElement,
    gameObject: GameObject,
    offscreenCanvas?: OffscreenCanvas,
  ): void;
}
