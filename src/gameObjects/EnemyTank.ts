import { Sound } from '../core';
import { GameUpdateArgs, GameState, Tag } from '../game';
import { TankColor, TankSkinAnimation, TankTier } from '../tank';
import * as config from '../config';

import { Tank } from './Tank';

export class EnemyTank extends Tank {
  public tags = [Tag.Tank, Tag.Enemy];
  public zIndex = config.ENEMY_TANK_Z_INDEX;
  private healthSkinAnimations = new Map<number, TankSkinAnimation>();
  private hitSound: Sound;

  protected setup(updateArgs: GameUpdateArgs): void {
    const { audioLoader, spriteLoader } = updateArgs;

    this.hitSound = audioLoader.load('hit.enemy');

    // Tanks with drop should be blinking when paused
    if (this.type.hasDrop) {
      this.ignorePause = true;
    }

    // Currently only tier D tank has more than 1 health
    if (this.type.tier === TankTier.D) {
      this.healthSkinAnimations.set(
        4,
        new TankSkinAnimation(spriteLoader, this.type, [
          TankColor.Default,
          TankColor.Secondary,
        ]),
      );

      this.healthSkinAnimations.set(
        3,
        new TankSkinAnimation(spriteLoader, this.type, [
          TankColor.Default,
          TankColor.Primary,
        ]),
      );

      this.healthSkinAnimations.set(
        2,
        new TankSkinAnimation(spriteLoader, this.type, [
          TankColor.Secondary,
          TankColor.Primary,
        ]),
      );
    }

    this.healthSkinAnimations.set(
      1,
      new TankSkinAnimation(spriteLoader, this.type, [TankColor.Default]),
    );

    this.skinAnimation = this.healthSkinAnimations.get(this.attributes.health);

    super.setup(updateArgs);
  }

  protected update(updateArgs: GameUpdateArgs): void {
    const { gameState } = updateArgs;

    const shouldIdle =
      this.freezeState.hasChangedTo(true) ||
      gameState.hasChangedTo(GameState.Paused);

    if (shouldIdle) {
      this.idle();
    }

    const isIdle = this.freezeState.is(true) || gameState.is(GameState.Paused);

    // Only update animation when idle, other components should not receive
    // updates
    if (isIdle) {
      // When tank spawns during freeze his collision box should be updated
      this.collider.update();

      // Tanks with drop should be blinking when paused or freezed
      if (this.type.hasDrop) {
        this.updateAnimation(updateArgs.deltaTime);
        this.setNeedsPaint();
      }
      return;
    }

    super.update(updateArgs);
  }

  protected receiveHit(damage: number): void {
    super.receiveHit(damage);

    if (!this.isAlive()) {
      return;
    }

    this.hitSound.play();

    // Enemy drop powerup on first hit
    // - for tiers A,B,C - on death, because they have 1 health
    // - for tier D - on first hit, because they have 4 health
    // Make sure tier D won't drop powerup after first hit.
    this.discardDrop();

    // Change skin based on number of health left
    this.skinAnimation = this.healthSkinAnimations.get(this.attributes.health);
  }

  public discardDrop(): this {
    this.type.hasDrop = false;
    this.ignorePause = false;

    // Remove drop animation frames
    this.healthSkinAnimations.forEach((animation) => {
      animation.updateFrames();
    });

    return this;
  }
}
