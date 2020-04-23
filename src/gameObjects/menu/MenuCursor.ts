import {
  Animation,
  GameObject,
  SpriteAlignment,
  SpritePainter,
} from '../../core';
import { GameUpdateArgs, Rotation } from '../../game';
import {
  TankAnimationFrame,
  TankColor,
  TankType,
  TankMoveAnimation,
} from '../../tank';

export class MenuCursor extends GameObject {
  public readonly painter = new SpritePainter();
  private animation: Animation<TankAnimationFrame>;

  constructor() {
    super(60, 60);

    this.painter.alignment = SpriteAlignment.MiddleCenter;
  }

  protected setup({ spriteLoader }: GameUpdateArgs): void {
    this.animation = new TankMoveAnimation(
      spriteLoader,
      TankType.PlayerA(),
      [TankColor.Primary],
      Rotation.Right,
    );

    this.updateSprite();
  }

  protected update(updateArgs: GameUpdateArgs): void {
    this.animation.update(updateArgs.deltaTime);

    this.updateSprite();
    this.setNeedsPaint();
  }

  private updateSprite(): void {
    const frame = this.animation.getCurrentFrame();
    const sprite = frame.getSprite(0);

    this.painter.sprite = sprite;
  }
}
