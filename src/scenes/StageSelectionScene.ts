import {
  GameObject,
  GameObjectUpdateArgs,
  RectRenderer,
  SpriteTextRenderer,
  Text,
} from '../core';
import * as config from '../config';

export class StageSelectionScene extends GameObject {
  public setup({ spriteFontLoader }: GameObjectUpdateArgs): void {
    this.renderer = new RectRenderer(config.BACKGROUND_COLOR);

    const font = spriteFontLoader.load('primary');
    const text = new Text('HEY MAN HOW IT IS GOING\nBRO', font, {
      scale: 4,
    });

    const textRenderer = new SpriteTextRenderer(text);

    const stageText = new GameObject(text.getWidth(), text.getHeight());
    stageText.renderer = textRenderer;

    this.add(stageText);
  }
}
