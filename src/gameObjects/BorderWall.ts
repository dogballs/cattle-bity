import { BoxCollider, GameObject, RectPainter } from '../core';
import { GameUpdateArgs, Tag } from '../game';
import * as config from '../config';

export class BorderWall extends GameObject {
  public collider = new BoxCollider(this);
  public painter = new RectPainter(config.COLOR_GRAY);
  public tags = [Tag.Wall, Tag.Border, Tag.BlockMove];

  protected setup({ collisionSystem }: GameUpdateArgs): void {
    collisionSystem.register(this.collider);
  }
}
