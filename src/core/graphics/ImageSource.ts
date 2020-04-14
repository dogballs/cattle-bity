import { Subject } from '../Subject';

export abstract class ImageSource {
  public readonly loaded = new Subject();

  abstract getElement(): CanvasImageSource;
  abstract getWidth(): number;
  abstract getHeight(): number;
  abstract isLoaded(): boolean;
}
