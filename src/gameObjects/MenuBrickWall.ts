import { BrickWall } from './BrickWall';

export class MenuBrickWall extends BrickWall {
  protected getSpriteIds(): string[] {
    return ['menu.brick.1', 'menu.brick.2'];
  }
}
