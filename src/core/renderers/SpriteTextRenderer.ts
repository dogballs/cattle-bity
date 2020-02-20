import { SpriteFont } from '../fonts';

import { Renderer } from './Renderer';

export class SpriteTextRenderer extends Renderer {
  public font: SpriteFont;
  public text = '';

  constructor(font: SpriteFont) {
    super();

    this.font = font;
  }

  public render(canvas: HTMLCanvasElement): void {
    if (this.font.texture.imageElement === null) {
      return;
    }

    const context = canvas.getContext('2d');

    const sprites = this.font.word(this.text);

    sprites.forEach((sprite) => {
      context.drawImage(
        sprite.texture.imageElement,
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
  }
}
