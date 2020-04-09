import { TerrainType } from '../terrain';

import { TerrainText } from './TerrainText';

export class VictoryHeading extends TerrainText {
  constructor() {
    super('VICTORY', TerrainType.Brick, {
      lineSpacing: 6,
    });
  }
}
