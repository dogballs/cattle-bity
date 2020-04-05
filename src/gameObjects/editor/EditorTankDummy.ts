import { Collider, GameObject, SpritePainter } from '../../core';
import { GameUpdateArgs, Rotation, Tag } from '../../game';
import { TankType, TankSpriteId } from '../../tank';

export class EditorTankDummy extends GameObject {
  public collider = new Collider(false);
  public painter = new SpritePainter();
  public tags = [Tag.EditorBlockMove];
  private type: TankType;

  constructor(type: TankType, rotation = Rotation.Up) {
    super(64, 64);

    this.type = type;
    this.pivot.set(0.5, 0.5);
    this.rotation = rotation;
  }

  protected setup({ spriteLoader }: GameUpdateArgs): void {
    const spriteId = TankSpriteId.create(this.type, this.rotation, 1);
    const sprite = spriteLoader.load(spriteId);
    this.painter.sprite = sprite;
  }
}
