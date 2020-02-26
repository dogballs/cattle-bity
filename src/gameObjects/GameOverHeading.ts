import { TerrainTextNode } from './TerrainTextNode';
import { TerrainType } from '../terrain';
import * as config from '../config';

export class GameOverHeading extends TerrainTextNode {
  constructor() {
    super('primary', 'GAME\nOVER', TerrainType.Brick, {
      lineSpacing: 6,
      scale: config.TILE_SIZE_SMALL,
    });
  }
}
