import { ImageSource } from '../ImageSource';

export class CanvasImage extends ImageSource {
  private readonly canvasElement: NativeCanvas;

  constructor(canvasElement: NativeCanvas) {
    super();

    this.canvasElement = canvasElement;
  }

  public getElement(): NativeCanvas {
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
