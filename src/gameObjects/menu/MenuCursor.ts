import {
  Alignment,
  Animation,
  GameObject,
  Sprite,
  SpritePainter,
} from '../../core';
import { GameObjectUpdateArgs, Rotation } from '../../game';
import { TankType, TankMoveAnimation } from '../../tank';

export class MenuCursor extends GameObject {
  public readonly painter = new SpritePainter();
  private animation: Animation<Sprite>;

  constructor() {
    super(60, 60);

    this.painter.alignment = Alignment.MiddleCenter;
  }

  protected setup({ spriteLoader }: GameObjectUpdateArgs): void {
    this.animation = new TankMoveAnimation(
      spriteLoader,
      TankType.PlayerPrimaryA,
      Rotation.Right,
    );
    this.painter.sprite = this.animation.getCurrentFrame();
  }

  protected update(updateArgs: GameObjectUpdateArgs): void {
    this.animation.update(updateArgs.deltaTime);
    this.painter.sprite = this.animation.getCurrentFrame();
  }
}
