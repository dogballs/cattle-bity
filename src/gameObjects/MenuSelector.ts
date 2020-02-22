import {
  Alignment,
  Animation,
  GameObject,
  Rect,
  Rotation,
  Sprite,
  SpriteRenderer,
} from '../core';
import { TankColor, TankParty, TankTier, TankMoveAnimation } from '../tank';

export class MenuSelector extends GameObject {
  public readonly renderer = new SpriteRenderer();
  private readonly animation: Animation<Sprite>;

  constructor(height = 52) {
    super(height, height);

    this.animation = new TankMoveAnimation(
      TankParty.Player,
      TankColor.Primary,
      TankTier.A,
      new Rect(0, 0, 52, 52),
      Rotation.Right,
    );

    this.renderer.alignment = Alignment.MiddleCenter;
    this.renderer.sprite = this.animation.getCurrentFrame();
  }

  public update(): void {
    this.animation.animate();
    this.renderer.sprite = this.animation.getCurrentFrame();
  }
}
