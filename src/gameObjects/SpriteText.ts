import {
  ColorSpriteFontGenerator,
  GameObject,
  Size,
  Sprite,
  SpriteTextPainter,
  Text,
  TextOptions,
} from '../core';
import { GameUpdateArgs } from '../game';
import * as config from '../config';

export interface SpriteTextOptions extends TextOptions {
  color?: string;
  letterSpacing?: number;
}

const DEFAULT_OPTIONS: SpriteTextOptions = {
  color: null,
  letterSpacing: 4,
  lineSpacing: 16,
};

export class SpriteText extends GameObject {
  public painter = new SpriteTextPainter();
  private readonly text: Text<Sprite>;
  private options: SpriteTextOptions;
  private colorSpriteFontGenerator: ColorSpriteFontGenerator = null;

  constructor(text = '', options: SpriteTextOptions = {}) {
    super();

    this.options = Object.assign({}, DEFAULT_OPTIONS, options);

    this.painter.color = this.options.color;

    this.text = new Text(text, this.options);
  }

  protected setup({ colorSpriteFontGenerator }: GameUpdateArgs): void {
    this.colorSpriteFontGenerator = colorSpriteFontGenerator;

    const font = this.colorSpriteFontGenerator.get(
      config.PRIMARY_SPRITE_FONT_ID,
      this.painter.color,
    );
    this.text.setFont(font);

    this.size.copyFrom(this.text.getSize());

    this.painter.text = this.text;
  }

  public setColor(color: string): void {
    // If null - called before setup. Simply set the color, it will be loaded
    // during setup.
    if (this.colorSpriteFontGenerator === null) {
      this.painter.color = color;
      return;
    }

    const font = this.colorSpriteFontGenerator.get(
      config.PRIMARY_SPRITE_FONT_ID,
      color,
    );

    this.text.setFont(font);

    this.painter.color = color;
  }

  public setText(text: string): void {
    this.text.setText(text);
    this.size.copyFrom(this.text.getSize());
  }

  public getTextSize(): Size {
    return this.text.getSize();
  }
}
