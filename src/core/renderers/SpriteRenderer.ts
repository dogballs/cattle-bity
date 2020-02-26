import { Alignment } from '../Alignment';
import { GameObject } from '../GameObject';
import { Rect } from '../Rect';
import { Sprite } from '../Sprite';

import { Renderer } from './Renderer';

export class SpriteRenderer extends Renderer {
  public alignment: Alignment = Alignment.Stretch;
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

    // Texture is not yet available
    if (!this.sprite.isTextureLoaded()) {
      return;
    }

    const objectBox = gameObject.getWorldBoundingBox();
    const objectRect = objectBox.toRect();

    let targetRect = objectRect;
    if (this.alignment === Alignment.Stretch) {
      targetRect = objectRect;
    } else if (this.alignment === Alignment.TopLeft) {
      targetRect = new Rect(
        objectRect.x,
        objectRect.y,
        this.sprite.targetRect.width,
        this.sprite.targetRect.height,
      );
    } else if (this.alignment === Alignment.MiddleCenter) {
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
