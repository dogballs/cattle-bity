import { GameObject, Vector } from '../core';
import { TileFont, TileFontConfig, TileFontConfigSchema } from '../font';
import { TerrainFactory, TerrainType } from '../terrain';
import { ConfigParser } from '../ConfigParser';
import * as config from '../config';

// TODO: use loader
import * as fontJSON from '../../data/fonts/tile-font.json';

import { Scene } from './Scene';

const WORDS = ['GAME', 'OVER'];
const CENTER_VERTICAL_OFFSET = -32;

export class GameOverScene extends Scene {
  public setup(): void {
    const fontConfig = ConfigParser.parse<TileFontConfig>(
      fontJSON,
      TileFontConfigSchema,
    );
    const font = new TileFont(fontConfig, {
      lineSpacing: 6,
      scale: new Vector(config.TILE_SIZE_SMALL, config.TILE_SIZE_SMALL),
    });

    const wordWidths = WORDS.map((word) => font.getWordWidth(word));
    const width = Math.max(...wordWidths);
    const height = font.getLinesHeight(WORDS);

    const text = new GameObject(width, height);

    const rects = font.lines(WORDS);
    const tiles = TerrainFactory.createFromRegions(TerrainType.Brick, rects);

    text.add(...tiles);

    text.setCenter(this.root.getChildrenCenter());
    text.position.addY(CENTER_VERTICAL_OFFSET);
    this.root.add(text);
  }
}
