import { Sprite } from '../graphics';
import { Text } from '../text';

import { Painter } from '../Painter';
import { RenderObject } from '../RenderObject';

export class SpriteTextPainter extends Painter {
  public text: Text<Sprite> = null;
  public color: string = null;

  constructor(text: Text<Sprite> = null, color: string = null) {
    super();

    this.text = text;
    this.color = color;
  }

  public paint(
    context: CanvasRenderingContext2D,
    renderObject: RenderObject,
  ): void {
    if (this.text === null) {
      return;
    }

    const { min: worldPosition } = renderObject.getWorldBoundingBox();

    const sprites = this.text.build();

    sprites.forEach((sprite) => {
      context.drawImage(
        sprite.image.getElement(),
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
