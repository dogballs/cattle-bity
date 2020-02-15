import { GameObject } from '../GameObject';

export abstract class Renderer {
  public visible = true;

  public abstract render(
    canvas: HTMLCanvasElement,
    gameObject: GameObject,
  ): void;
}
