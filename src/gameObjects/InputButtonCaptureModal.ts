import { GameObject, RectPainter } from '../core';
import { SpriteText } from '../gameObjects';
import * as config from '../config';

export class InputButtonCaptureModal extends GameObject {
  public painter = new RectPainter(config.COLOR_BACKDROP);
  private container = new GameObject(512, 256);
  private text = new SpriteText('PRESS ANY KEY', { color: config.COLOR_WHITE });

  constructor(width: number, height: number) {
    super(width, height);
  }

  protected setup(): void {
    this.container.painter = new RectPainter(
      config.COLOR_GRAY,
      config.COLOR_WHITE,
    );
    this.container.setCenter(this.getSelfCenter());
    this.add(this.container);

    this.text.setCenter(this.getSelfCenter());
    this.text.origin.set(0.5, 0.5);
    this.add(this.text);
  }
}
