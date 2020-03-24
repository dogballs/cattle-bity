import { GameObject } from '../GameObject';
import { Sprite } from '../Sprite';
import { SpriteFont, Text } from '../text';

import { Renderer } from './Renderer';

export class SpriteTextRenderer extends Renderer {
  public text: Text<Sprite> = null;
  public color: string = null;

  constructor(text: Text<Sprite> = null, color: string = null) {
    super();

    this.text = text;
    this.color = color;
  }

  public render(
    canvas: HTMLCanvasElement,
    gameObject: GameObject,
    offscreenCanvas: OffscreenCanvas,
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

    const context = canvas.getContext('2d');

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

    const offscreenContext = offscreenCanvas.getContext('2d');

    const textSize = this.text.getSize();

    offscreenContext.globalCompositeOperation = 'source-over';
    offscreenContext.clearRect(
      0,
      0,
      offscreenCanvas.width,
      offscreenCanvas.height,
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
      offscreenCanvas,
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
