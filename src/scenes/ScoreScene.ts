import {
  GameObject,
  GameObjectUpdateArgs,
  RectRenderer,
  SpriteFont,
  SpriteFontConfig,
} from '../core';
import { SpriteFontConfigSchema } from '../font';
import { ConfigParser } from '../ConfigParser';
import * as config from '../config';

import * as fontJSON from '../../data/fonts/sprite-font.json';

export class ScoreScene extends GameObject {
  public setup({ textureLoader }: GameObjectUpdateArgs): void {
    this.renderer = new RectRenderer(config.BACKGROUND_COLOR);

    const fontConfig = ConfigParser.parse<SpriteFontConfig>(
      fontJSON,
      SpriteFontConfigSchema,
    );
    const texture = textureLoader.load('data/fonts/sprite-font.png', true);
    const font = new SpriteFont(fontConfig, texture);
    console.log(font);
  }
}
