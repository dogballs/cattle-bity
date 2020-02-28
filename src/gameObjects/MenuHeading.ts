import { TextAlignment } from '../core';
import { TerrainType } from '../terrain';
import * as config from '../config';

import { TerrainText } from './TerrainText';

export class MenuHeading extends TerrainText {
  constructor() {
    super('BATTLE\nCITY', TerrainType.MenuBrick, {
      alignment: TextAlignment.Center,
      lineSpacing: 3,
      scale: config.TILE_SIZE_SMALL,
    });
  }
}
