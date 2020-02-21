import {
  GameObject,
  RectRenderer,
  SpriteFont,
  SpriteFontConfig,
  SpriteTextRenderer,
  Text,
  TextureLoader,
} from '../core';
import { ConfigParser } from '../ConfigParser';
import { SpriteFontConfigSchema } from '../font';
import * as config from '../config';

// TODO: use loader
import * as fontJSON from '../../data/fonts/sprite-font.json';

import { Scene } from './Scene';

export class StageSelectionScene extends Scene {
  public setup(): void {
    this.root.renderer = new RectRenderer(config.BACKGROUND_COLOR);

    const fontConfig = ConfigParser.parse<SpriteFontConfig>(
      fontJSON,
      SpriteFontConfigSchema,
    );

    const texture = TextureLoader.load('data/fonts/sprite-font.png');
    const font = new SpriteFont(fontConfig, texture);
    const text = new Text('HEY MAN HOW IT IS GOING\nBRO', font, {
      scale: 4,
    });

    const textRenderer = new SpriteTextRenderer(text);

    const stageText = new GameObject(text.getWidth(), text.getHeight());
    stageText.renderer = textRenderer;

    this.root.add(stageText);
  }
}
