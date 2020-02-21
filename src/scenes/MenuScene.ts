import {
  GameObject,
  RectFont,
  RectFontConfig,
  Text,
  TextAlignment,
} from '../core';
import { RectFontConfigSchema } from '../font';
import { TerrainFactory, TerrainType } from '../terrain';
import { ArrayUtils } from '../utils';
import { ConfigParser } from '../ConfigParser';
import * as config from '../config';

import { Scene } from './Scene';

// TODO: use loader
import * as fontJSON from '../../data/fonts/rect-font.json';

export class MenuScene extends Scene {
  public setup(): void {
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

    const textGroup = new GameObject(text.getWidth(), text.getHeight());
    textGroup.add(...tiles);
    textGroup.setCenter(this.root.getChildrenCenter());
    this.root.add(textGroup);
  }
}
