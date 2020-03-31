import { BrickTerrainTile } from './BrickTerrainTile';

export class MenuBrickTerrainTile extends BrickTerrainTile {
  protected getSpriteIds(): string[] {
    return ['terrain.menu-brick.1', 'terrain.menu-brick.2'];
  }
}
