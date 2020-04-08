import { TerrainType } from '../../terrain';

import { BrickTerrainTile } from './BrickTerrainTile';

export class MenuBrickTerrainTile extends BrickTerrainTile {
  public type: TerrainType.MenuBrick;

  protected getSpriteIds(): string[] {
    return ['terrain.menu-brick.1', 'terrain.menu-brick.2'];
  }
}
