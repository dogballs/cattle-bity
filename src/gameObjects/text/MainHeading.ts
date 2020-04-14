import { TextAlignment } from '../../core';
import { TerrainType } from '../../terrain';

import { TerrainText } from './TerrainText';

export class MainHeading extends TerrainText {
  constructor() {
    super('BATTLE\nCITY', TerrainType.MenuBrick, {
      alignment: TextAlignment.Center,
      lineSpacing: 3,
    });
  }
}
