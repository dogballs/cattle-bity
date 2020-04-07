import { SpriteLoader } from '../core';
import { Rotation, RotationMap } from '../game';
import { Tank, TankState } from '../gameObjects';

import { TankIdleAnimation, TankMoveAnimation } from './animations';

import { TankAnimationFrame } from './TankAnimationFrame';
import { TankColor } from './TankColor';
import { TankType } from './TankType';

// TODO: Remake to factory?

export class TankSkinAnimation {
  protected rotation: Rotation = Rotation.Up;
  protected tankState: TankState = TankState.Uninitialized;

  protected readonly moveAnimationMap = new RotationMap<TankMoveAnimation>();
  protected readonly idleAnimationMap = new RotationMap<TankIdleAnimation>();
  protected currentAnimationMap: RotationMap<
    TankMoveAnimation | TankIdleAnimation
  >;

  constructor(spriteLoader: SpriteLoader, type: TankType, colors: TankColor[]) {
    this.idleAnimationMap.set(
      Rotation.Up,
      new TankIdleAnimation(spriteLoader, type, colors, Rotation.Up),
    );
    this.idleAnimationMap.set(
      Rotation.Down,
      new TankIdleAnimation(spriteLoader, type, colors, Rotation.Down),
    );
    this.idleAnimationMap.set(
      Rotation.Left,
      new TankIdleAnimation(spriteLoader, type, colors, Rotation.Left),
    );
    this.idleAnimationMap.set(
      Rotation.Right,
      new TankIdleAnimation(spriteLoader, type, colors, Rotation.Right),
    );

    this.moveAnimationMap.set(
      Rotation.Up,
      new TankMoveAnimation(spriteLoader, type, colors, Rotation.Up),
    );
    this.moveAnimationMap.set(
      Rotation.Down,
      new TankMoveAnimation(spriteLoader, type, colors, Rotation.Down),
    );
    this.moveAnimationMap.set(
      Rotation.Left,
      new TankMoveAnimation(spriteLoader, type, colors, Rotation.Left),
    );
    this.moveAnimationMap.set(
      Rotation.Right,
      new TankMoveAnimation(spriteLoader, type, colors, Rotation.Right),
    );

    this.currentAnimationMap = this.idleAnimationMap;
  }

  public update(tank: Tank, deltaTime: number): void {
    this.rotation = tank.rotation;

    if (tank.state === this.tankState) {
      const animation = this.currentAnimationMap.get(this.rotation);
      animation.update(deltaTime);
      return;
    }

    this.tankState = tank.state;
    this.currentAnimationMap =
      tank.state === TankState.Idle
        ? this.idleAnimationMap
        : this.moveAnimationMap;

    const animation = this.currentAnimationMap.get(tank.rotation);
    animation.reset();
  }

  // Tank might lose his drop, use it remove drop animation frames
  public updateFrames(): void {
    this.idleAnimationMap.forEach((animation) => {
      animation.updateFrames();
    });

    this.moveAnimationMap.forEach((animation) => {
      animation.updateFrames();
    });
  }

  public getCurrentFrame(): TankAnimationFrame {
    const animation = this.currentAnimationMap.get(this.rotation);
    return animation.getCurrentFrame();
  }
}
