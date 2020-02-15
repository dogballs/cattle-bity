import { GameObject } from '../GameObject';
import { Rect } from '../Rect';
import { Sprite } from '../Sprite';
import { SpriteAlignment } from '../SpriteAlignment';

import { Renderer } from './Renderer';

export class SpriteRenderer extends Renderer {
  public alignment: SpriteAlignment = SpriteAlignment.Stretch;
  public sprite: Sprite = null;

  constructor(sprite: Sprite = null) {
    super();

    this.sprite = sprite;
  }

  public render(canvas: HTMLCanvasElement, gameObject: GameObject): void {
    // Simply no sprite object provided
    if (this.sprite === null) {
      return;
    }

    // Image element for sprite is not available
    if (this.sprite.texture.imageElement === null) {
      return;
    }

    const objectBox = gameObject.getWorldBoundingBox();
    const objectRect = objectBox.toRect();

    let targetRect = objectRect;
    if (this.alignment === SpriteAlignment.Stretch) {
      targetRect = objectRect;
    } else if (this.alignment === SpriteAlignment.TopLeft) {
      targetRect = new Rect(
        objectRect.x,
        objectRect.y,
        this.sprite.targetSize.width,
        this.sprite.targetSize.height,
      );
    } else if (this.alignment === SpriteAlignment.Center) {
      targetRect = new Rect(
        objectRect.x + objectRect.width / 2 - this.sprite.targetSize.width / 2,
        objectRect.y +
          objectRect.height / 2 -
          this.sprite.targetSize.height / 2,
        this.sprite.targetSize.width,
        this.sprite.targetSize.height,
      );
    }

    const context = canvas.getContext('2d');

    context.drawImage(
      this.sprite.texture.imageElement,
      this.sprite.textureRect.x,
      this.sprite.textureRect.y,
      this.sprite.textureRect.width,
      this.sprite.textureRect.height,
      targetRect.x,
      targetRect.y,
      targetRect.width,
      targetRect.height,
    );
  }
}
