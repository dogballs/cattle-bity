import {
  GameObject,
  GameObjectUpdateArgs,
  Sprite,
  SpriteTextRenderer,
  Text,
  TextOptions,
} from '../core';

export class SpriteTextNode extends GameObject {
  public renderer = new SpriteTextRenderer();
  private readonly text: Text<Sprite>;
  private readonly fontId: string;

  constructor(fontId: string, message = '', options: TextOptions = {}) {
    super();

    this.fontId = fontId;
    this.text = new Text(message, options);
  }

  protected setup({ spriteFontLoader }: GameObjectUpdateArgs): void {
    const font = spriteFontLoader.load(this.fontId);
    this.text.setFont(font);

    this.size.copy(this.text.getSize());

    this.renderer.text = this.text;
  }

  public setText(message: string): void {
    this.text.setText(message);
    this.size.copy(this.text.getSize());
  }
}
