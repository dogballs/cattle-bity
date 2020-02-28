import {
  GameObject,
  GameObjectUpdateArgs,
  Sprite,
  SpriteTextRenderer,
  Text,
  TextOptions,
} from '../core';
import * as constants from '../constants';

export class SpriteText extends GameObject {
  public renderer = new SpriteTextRenderer();
  private readonly text: Text<Sprite>;

  constructor(text = '', options: TextOptions = {}) {
    super();

    this.text = new Text(text, options);
  }

  protected setup({ spriteFontLoader }: GameObjectUpdateArgs): void {
    const font = spriteFontLoader.load(constants.PRIMARY_SPRITE_FONT_ID);
    this.text.setFont(font);

    this.size.copy(this.text.getSize());

    this.renderer.text = this.text;
  }

  public setText(text: string): void {
    this.text.setText(text);
    this.size.copy(this.text.getSize());
  }
}
