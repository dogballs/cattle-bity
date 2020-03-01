import { BoundingBox } from '../BoundingBox';

export abstract class Renderer {
  public visible = true;

  public abstract render(
    canvas: HTMLCanvasElement,
    boundingBox: BoundingBox,
    offscreenCanvas?: OffscreenCanvas,
  ): void;
}
