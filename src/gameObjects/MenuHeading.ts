import { TextAlignment } from '../core';
import { TerrainTextNode } from './TerrainTextNode';
import { TerrainType } from '../terrain';
import * as config from '../config';

export class MenuHeading extends TerrainTextNode {
  constructor() {
    super('primary', 'BATTLE\nCITY', TerrainType.MenuBrick, {
      alignment: TextAlignment.Center,
      lineSpacing: 3,
      scale: config.TILE_SIZE_SMALL,
    });
  }
}
