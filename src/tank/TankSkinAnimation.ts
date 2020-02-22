import { Animation, Rotation, Rect, Sprite } from '../core';
import { Tank, TankState } from '../gameObjects';

import { TankIdleAnimation, TankMoveAnimation } from './animations';

import { TankColor } from './TankColor';
import { TankTier } from './TankTier';
import { TankParty } from './TankParty';

// TODO: Remake to factory?

type AnimationMap = Map<Rotation, Animation<Sprite>>;

export class TankSkinAnimation {
  public readonly party: TankParty;
  public readonly color: TankColor;
  public readonly tier: TankTier;
  public readonly targetRect: Rect;
  public readonly hasDrop: boolean;

  protected rotation: Rotation = Rotation.Up;
  protected tankState: TankState = TankState.Uninitialized;

  protected readonly moveAnimationMap: AnimationMap = new Map();
  protected readonly idleAnimationMap: AnimationMap = new Map();
  protected currentAnimationMap: AnimationMap;

  constructor(
    party: TankParty,
    color: TankColor,
    tier: TankTier,
    targetRect: Rect,
    hasDrop = false,
  ) {
    this.party = party;
    this.color = color;
    this.tier = tier;
    this.targetRect = targetRect;
    this.hasDrop = hasDrop;

    this.idleAnimationMap.set(
      Rotation.Up,
      new TankIdleAnimation(
        party,
        color,
        tier,
        targetRect,
        Rotation.Up,
        hasDrop,
      ),
    );
    this.idleAnimationMap.set(
      Rotation.Down,
      new TankIdleAnimation(
        party,
        color,
        tier,
        targetRect,
        Rotation.Down,
        hasDrop,
      ),
    );
    this.idleAnimationMap.set(
      Rotation.Left,
      new TankIdleAnimation(
        party,
        color,
        tier,
        targetRect,
        Rotation.Left,
        hasDrop,
      ),
    );
    this.idleAnimationMap.set(
      Rotation.Right,
      new TankIdleAnimation(
        party,
        color,
        tier,
        targetRect,
        Rotation.Right,
        hasDrop,
      ),
    );

    this.moveAnimationMap.set(
      Rotation.Up,
      new TankMoveAnimation(
        party,
        color,
        tier,
        targetRect,
        Rotation.Up,
        hasDrop,
      ),
    );
    this.moveAnimationMap.set(
      Rotation.Down,
      new TankMoveAnimation(
        party,
        color,
        tier,
        targetRect,
        Rotation.Down,
        hasDrop,
      ),
    );
    this.moveAnimationMap.set(
      Rotation.Left,
      new TankMoveAnimation(
        party,
        color,
        tier,
        targetRect,
        Rotation.Left,
        hasDrop,
      ),
    );
    this.moveAnimationMap.set(
      Rotation.Right,
      new TankMoveAnimation(
        party,
        color,
        tier,
        targetRect,
        Rotation.Right,
        hasDrop,
      ),
    );

    this.currentAnimationMap = this.idleAnimationMap;
  }

  public update(tank: Tank): void {
    this.rotation = tank.rotation;

    if (tank.state === this.tankState) {
      const animation = this.currentAnimationMap.get(this.rotation);
      animation.animate();
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

  public getCurrentFrame(): Sprite {
    const animation = this.currentAnimationMap.get(this.rotation);
    return animation.getCurrentFrame();
  }
}
