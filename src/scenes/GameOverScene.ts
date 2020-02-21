import { GameObject, RectFont, RectFontConfig, Text } from '../core';
import { RectFontConfigSchema } from '../font';
import { TerrainFactory, TerrainType } from '../terrain';
import { ArrayUtils } from '../utils';
import { ConfigParser } from '../ConfigParser';
import * as config from '../config';

// TODO: use loader
import * as fontJSON from '../../data/fonts/rect-font.json';

import { Scene } from './Scene';

export class GameOverScene extends Scene {
  public setup(): void {
    const fontConfig = ConfigParser.parse<RectFontConfig>(
      fontJSON,
      RectFontConfigSchema,
    );
    const font = new RectFont(fontConfig);
    const text = new Text('GAME\nOVER', font, {
      lineSpacing: 6,
      scale: config.TILE_SIZE_SMALL,
    });

    const rects = text.build();
    const tiles = TerrainFactory.createFromRegions(
      TerrainType.Brick,
      ArrayUtils.flatten(rects),
    );

    const textGroup = new GameObject(text.getWidth(), text.getHeight());
    textGroup.add(...tiles);
    textGroup.setCenter(this.root.getChildrenCenter());
    textGroup.position.addY(-32);
    this.root.add(textGroup);
  }
}
