import { TerrainType } from '../../terrain';

import { BrickTerrainTile } from './BrickTerrainTile';

export class BlueBrickTerrainTile extends BrickTerrainTile {
  public type: TerrainType.BlueBrick;

  protected getSpriteIds(): string[] {
    return ['terrain.blue-brick.1', 'terrain.blue-brick.2'];
  }
}
