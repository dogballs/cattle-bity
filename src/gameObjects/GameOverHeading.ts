import { TerrainType } from '../terrain';

import { TerrainText } from './TerrainText';

export class GameOverHeading extends TerrainText {
  constructor() {
    super('GAME\nOVER', TerrainType.Brick, {
      lineSpacing: 6,
    });
  }
}
