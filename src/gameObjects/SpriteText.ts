import {
  GameObject,
  Sprite,
  SpriteTextRenderer,
  Text,
  TextOptions,
} from '../core';
import { GameObjectUpdateArgs } from '../game';
import * as config from '../config';

interface SpriteTextOptions extends TextOptions {
  color?: string;
}

const DEFAULT_OPTIONS = {
  color: null,
};

export class SpriteText extends GameObject {
  public renderer = new SpriteTextRenderer();
  private readonly text: Text<Sprite>;

  constructor(text = '', argOptions: SpriteTextOptions = {}) {
    super();

    const options = Object.assign({}, DEFAULT_OPTIONS, argOptions);

    this.renderer.color = options.color;
    this.text = new Text(text, options);
  }

  protected setup({ spriteFontLoader }: GameObjectUpdateArgs): void {
    const font = spriteFontLoader.load(config.PRIMARY_SPRITE_FONT_ID);
    this.text.setFont(font);

    this.size.copy(this.text.getSize());

    this.renderer.text = this.text;
  }

  public setText(text: string): void {
    this.text.setText(text);
    this.size.copy(this.text.getSize());
  }
}
