import {
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

  constructor(text = '', argOptions: SpriteTextOptions = {}) {
    super();

    const options = Object.assign({}, DEFAULT_OPTIONS, argOptions);

    this.painter.color = options.color;
    this.text = new Text(text, options);
  }

  protected setup({ spriteFontLoader }: GameUpdateArgs): void {
    const font = spriteFontLoader.load(config.PRIMARY_SPRITE_FONT_ID);
    this.text.setFont(font);

    this.size.copyFrom(this.text.getSize());

    this.painter.text = this.text;
  }

  public setColor(color: string): void {
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
