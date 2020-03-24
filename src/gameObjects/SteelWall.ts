import { GameObject, SpritePainter } from '../core';
import { GameObjectUpdateArgs, Tag } from '../game';

export class SteelWall extends GameObject {
  public tags = [Tag.Wall, Tag.Steel, Tag.BlockMove];
  public readonly painter = new SpritePainter();

  constructor() {
    super(32, 32);
  }

  protected setup({ spriteLoader }: GameObjectUpdateArgs): void {
    this.painter.sprite = spriteLoader.load('wall.steel');
  }
}
