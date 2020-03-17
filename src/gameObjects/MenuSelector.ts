import {
  Alignment,
  Animation,
  GameObject,
  Sprite,
  SpriteRenderer,
} from '../core';
import { GameObjectUpdateArgs, Rotation } from '../game';
import { TankType, TankMoveAnimation } from '../tank';

export class MenuSelector extends GameObject {
  public readonly renderer = new SpriteRenderer();
  private animation: Animation<Sprite>;

  constructor(height = 52) {
    super(height, height);

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

  protected update(): void {
    this.animation.animate();
    this.renderer.sprite = this.animation.getCurrentFrame();
  }
}
