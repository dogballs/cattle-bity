import {
  Alignment,
  Animation,
  GameObject,
  Sprite,
  SpriteRenderer,
} from '../../core';
import { GameObjectUpdateArgs, Rotation } from '../../game';
import { TankType, TankMoveAnimation } from '../../tank';

export class MenuCursor extends GameObject {
  public readonly renderer = new SpriteRenderer();
  private animation: Animation<Sprite>;

  constructor() {
    super(60, 60);

    this.renderer.alignment = Alignment.MiddleCenter;
  }

  protected setup({ spriteLoader }: GameObjectUpdateArgs): void {
    this.animation = new TankMoveAnimation(
      spriteLoader,
      TankType.PlayerPrimaryA,
      Rotation.Right,
    );
    this.renderer.sprite = this.animation.getCurrentFrame();
  }

  protected update(updateArgs: GameObjectUpdateArgs): void {
    this.animation.update(updateArgs.deltaTime);
    this.renderer.sprite = this.animation.getCurrentFrame();
  }
}