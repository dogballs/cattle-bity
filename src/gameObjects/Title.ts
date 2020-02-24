import {
  ArrayUtils,
  GameObject,
  RectFont,
  RectFontConfig,
  Text,
  TextAlignment,
} from '../core';
import { RectFontConfigSchema } from '../font';
import { TerrainFactory, TerrainType } from '../terrain';
import { ConfigParser } from '../ConfigParser';
import * as config from '../config';

import * as fontJSON from '../../data/fonts/rect-font.json';

export class Title extends GameObject {
  constructor() {
    super();

    const fontConfig = ConfigParser.parse<RectFontConfig>(
      fontJSON,
      RectFontConfigSchema,
    );
    const font = new RectFont(fontConfig);
    const text = new Text('BATTLE\nCITY', font, {
      alignment: TextAlignment.Center,
      lineSpacing: 3,
      scale: config.TILE_SIZE_SMALL,
    });

    const rects = text.build();
    const tiles = TerrainFactory.createFromRegions(
      TerrainType.MenuBrick,
      ArrayUtils.flatten(rects),
    );

    this.size.set(text.getWidth(), text.getHeight());

    this.add(...tiles);
  }
}
