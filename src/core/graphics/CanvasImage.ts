import { ImageSource } from './ImageSource';

type CanvasElement = HTMLCanvasElement | OffscreenCanvas;

export class CanvasImage extends ImageSource {
  private readonly canvasElement: CanvasElement;

  constructor(canvasElement: CanvasElement) {
    super();

    this.canvasElement = canvasElement;
  }

  public getElement(): CanvasElement {
    return this.canvasElement;
  }

  public getWidth(): number {
    return this.canvasElement.width;
  }

  public getHeight(): number {
    return this.canvasElement.height;
  }

  public isLoaded(): boolean {
    return true;
  }
}
