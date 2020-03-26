import { GameObject } from '../GameObject';
import { Painter } from '../Painter';
import { Sprite } from '../Sprite';
import { SpriteFont, Text } from '../text';

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
    gameObject: GameObject,
    offscreenContext: OffscreenCanvasRenderingContext2D,
  ): void {
    if (this.text === null) {
      return;
    }

    const font = this.text.getFont() as SpriteFont;
    if (font.image.imageElement === null) {
      return;
    }

    const { min: worldPosition } = gameObject.getWorldBoundingBox();

    const sprites = this.text.build();

    if (this.color === null) {
      sprites.forEach((sprite) => {
        context.drawImage(
          sprite.image.imageElement,
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
      return;
    }

    const textSize = this.text.getSize();

    offscreenContext.globalCompositeOperation = 'source-over';
    offscreenContext.clearRect(
      0,
      0,
      offscreenContext.canvas.width,
      offscreenContext.canvas.height,
    );

    offscreenContext.imageSmoothingEnabled = false;

    sprites.forEach((sprite) => {
      offscreenContext.drawImage(
        sprite.image.imageElement,
        sprite.sourceRect.x,
        sprite.sourceRect.y,
        sprite.sourceRect.width,
        sprite.sourceRect.height,
        sprite.targetRect.x,
        sprite.targetRect.y,
        sprite.targetRect.width,
        sprite.targetRect.height,
      );
    });

    const backupGlobalCompositeOperation =
      offscreenContext.globalCompositeOperation;

    offscreenContext.fillStyle = this.color;
    offscreenContext.globalCompositeOperation = 'source-in';
    offscreenContext.fillRect(0, 0, textSize.width, textSize.height);

    context.drawImage(
      offscreenContext.canvas,
      0,
      0,
      textSize.width,
      textSize.height,
      worldPosition.x,
      worldPosition.y,
      textSize.width,
      textSize.height,
    );

    offscreenContext.globalCompositeOperation = backupGlobalCompositeOperation;
  }
}
