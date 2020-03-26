import { Alignment } from '../Alignment';
import { GameObject } from '../GameObject';
import { Painter } from '../Painter';
import { Rect } from '../Rect';
import { Sprite } from '../Sprite';

export class SpritePainter extends Painter {
  public alignment: Alignment = Alignment.MiddleCenter;
  public sprite: Sprite = null;

  constructor(sprite: Sprite = null) {
    super();

    this.sprite = sprite;
  }

  public paint(
    context: CanvasRenderingContext2D,
    gameObject: GameObject,
  ): void {
    // Simply no sprite object provided
    if (this.sprite === null) {
      return;
    }

    // Image is not yet available
    if (!this.sprite.isImageLoaded()) {
      return;
    }

    const objectRect = gameObject.getWorldBoundingBox().toRect();

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

    context.drawImage(
      this.sprite.image.imageElement,
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
