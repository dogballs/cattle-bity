import { GameObject } from '../GameObject';
import { Sprite } from '../Sprite';
import { SpriteFont, Text } from '../text';

import { Renderer } from './Renderer';

export class SpriteTextRenderer extends Renderer {
  public text: Text<Sprite> = null;

  constructor(text: Text<Sprite> = null) {
    super();

    this.text = text;
  }

  public render(canvas: HTMLCanvasElement, gameObject: GameObject): void {
    if (this.text === null) {
      return;
    }

    const font = this.text.getFont() as SpriteFont;
    if (font.texture.imageElement === null) {
      return;
    }

    const { min: worldPosition } = gameObject.getWorldBoundingBox();

    const sprites = this.text.build();

    const context = canvas.getContext('2d');

    sprites.forEach((sprite) => {
      context.drawImage(
        sprite.texture.imageElement,
        sprite.sourceRect.x,
        sprite.sourceRect.y,
        sprite.sourceRect.width,
        sprite.sourceRect.height,
        worldPosition.x + sprite.targetRect.x,
        worldPosition.y + sprite.targetRect.y,
        sprite.targetRect.width,
        sprite.targetRect.height,
      );
    });
  }
}
