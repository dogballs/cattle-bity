import { Sprite } from '../graphics';
import { RenderContext } from '../render';
import { Text } from '../text';

import { Painter } from '../Painter';
import { Rect } from '../Rect';
import { RenderObject } from '../RenderObject';

export class SpriteTextPainter extends Painter {
  public text: Text<Sprite> = null;
  public color: string = null;

  constructor(text: Text<Sprite> = null, color: string = null) {
    super();

    this.text = text;
    this.color = color;
  }

  public paint(context: RenderContext, renderObject: RenderObject): void {
    if (this.text === null) {
      return;
    }

    const { min: worldPosition } = renderObject.getWorldBoundingBox();

    const sprites = this.text.build();

    sprites.forEach((sprite) => {
      const destinationRect = new Rect(
        worldPosition.x + sprite.destinationRect.x,
        worldPosition.y + sprite.destinationRect.y,
        sprite.destinationRect.width,
        sprite.destinationRect.height,
      );
      context.drawImage(sprite.image, sprite.sourceRect, destinationRect);
    });
  }
}
