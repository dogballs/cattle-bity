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
    if (!this.sprite.isTextureReady()) {
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
        this.sprite.targetRect.width,
        this.sprite.targetRect.height,
      );
    } else if (this.alignment === SpriteAlignment.Center) {
      targetRect = new Rect(
        objectRect.x + objectRect.width / 2 - this.sprite.targetRect.width / 2,
        objectRect.y +
          objectRect.height / 2 -
          this.sprite.targetRect.height / 2,
        this.sprite.targetRect.width,
        this.sprite.targetRect.height,
      );
    }

    const context = canvas.getContext('2d');

    context.drawImage(
      this.sprite.texture.imageElement,
      this.sprite.sourceRect.x,
      this.sprite.sourceRect.y,
      this.sprite.sourceRect.width,
      this.sprite.sourceRect.height,
      targetRect.x,
      targetRect.y,
      targetRect.width,
      targetRect.height,
    );
  }
}
