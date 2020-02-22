import { Alignment } from '../Alignment';
import { GameObject } from '../GameObject';
import { Sprite } from '../Sprite';
import { SpriteFont, Text } from '../text';

import { Renderer } from './Renderer';

export class SpriteTextRenderer extends Renderer {
  public alignment: Alignment = Alignment.TopLeft;
  public text: Text<Sprite> = null;

  constructor(text: Text<Sprite> = null) {
    super();

    this.text = text;
  }

  public render(canvas: HTMLCanvasElement, gameObject: GameObject): void {
    if (this.text === null) {
      return;
    }

    const font = this.text.font as SpriteFont;
    if (font.texture.imageElement === null) {
      return;
    }

    const objectBox = gameObject.getWorldBoundingBox();
    const objectRect = objectBox.toRect();

    const offset = objectBox.min.clone();

    if (this.alignment === Alignment.MiddleCenter) {
      offset.addX((objectRect.width - this.text.getWidth()) / 2);
      offset.addY((objectRect.height - this.text.getHeight()) / 2);
    } else if (this.alignment === Alignment.MiddleLeft) {
      offset.addY((objectRect.height - this.text.getHeight()) / 2);
    }

    const sprites = this.text.build();

    const context = canvas.getContext('2d');

    sprites.forEach((sprite) => {
      context.drawImage(
        sprite.texture.imageElement,
        sprite.sourceRect.x,
        sprite.sourceRect.y,
        sprite.sourceRect.width,
        sprite.sourceRect.height,
        sprite.targetRect.x + offset.x,
        sprite.targetRect.y + offset.y,
        sprite.targetRect.width,
        sprite.targetRect.height,
      );
    });
  }
}
