import { TerrainType } from '../terrain';
import * as config from '../config';

import { TerrainText } from './TerrainText';

export class GameOverHeading extends TerrainText {
  constructor() {
    super('GAME\nOVER', TerrainType.Brick, {
      lineSpacing: 6,
      scale: config.TILE_SIZE_SMALL,
    });
  }
}
