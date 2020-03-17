import {
  Alignment,
  Animation,
  GameObject,
  Sprite,
  SpriteRenderer,
  Subject,
  Timer,
} from '../core';
import { GameObjectUpdateArgs, Rotation, Tag } from '../game';
import {
  TankAttributes,
  TankBehavior,
  TankDeathReason,
  TankSkinAnimation,
  TankType,
} from '../tank';
import * as config from '../config';

import { Bullet } from './Bullet';
import { Shield } from './Shield';

export enum TankState {
  Uninitialized,
  Idle,
  Moving,
}

export class Tank extends GameObject {
  public type: TankType;
  public attributes: TankAttributes;
  public behavior: TankBehavior;
  public skinAnimation: TankSkinAnimation;
  public collider = true;
  public tags = [Tag.Tank];
  public bullets: Bullet[] = [];
  public shield: Shield = null;
  public died = new Subject<{ reason: TankDeathReason }>();
  public state = TankState.Uninitialized;
  public renderer: SpriteRenderer = new SpriteRenderer();
  protected shieldTimer = new Timer();
  protected animation: Animation<Sprite>;

  constructor(width: number, height: number) {
    super(width, height);

    this.pivot.set(0.5, 0.5);

    this.renderer.alignment = Alignment.MiddleCenter;

    this.shieldTimer.done.addListener(this.handleShieldTimer);
  }

  protected setup(updateArgs: GameObjectUpdateArgs): void {
    this.behavior.setup(this, updateArgs);
  }

  protected update(updateArgs: GameObjectUpdateArgs): void {
    this.shieldTimer.tick();

    this.behavior.update(this, updateArgs);

    this.skinAnimation.update(this);

    this.renderer.sprite = this.skinAnimation.getCurrentFrame();
  }

  protected collide(target: GameObject): void {
    if (target.tags.includes(Tag.BlockMove)) {
      const tankWorldBox = this.getWorldBoundingBox();
      const targetWorldBox = target.getWorldBoundingBox();

      // TODO: rework after collisions, because now we are tied to axis
      const rotation = this.getWorldRotation();

      // Fix overlap during collision
      if (rotation === Rotation.Up) {
        this.translateY(tankWorldBox.min.y - targetWorldBox.max.y);
      } else if (rotation === Rotation.Down) {
        this.translateY(targetWorldBox.min.y - tankWorldBox.max.y);
      } else if (rotation === Rotation.Left) {
        this.translateY(tankWorldBox.min.x - targetWorldBox.max.x);
      } else if (rotation === Rotation.Right) {
        this.translateY(targetWorldBox.min.x - tankWorldBox.max.x);
      }

      // If it collides with multiple brick at a time, each of them will
      // invoke translation above, matrix is updated
      this.updateWorldMatrix();
    }

    if (target.tags.includes(Tag.Bullet)) {
      const bullet = target as Bullet;

      // Prevent self-destruction
      if (this.bullets.includes(bullet)) {
        return;
      }

      // If tank has shield - swallow the bullet
      if (this.shield !== null) {
        bullet.nullify();
        return;
      }

      // Enemy bullets don't affect enemy tanks
      if (bullet.tags.includes(Tag.Enemy) && this.tags.includes(Tag.Enemy)) {
        return;
      }

      const nextHealth = this.attributes.health - bullet.tankDamage;
      if (nextHealth > 0) {
        this.attributes.health = nextHealth;
        bullet.explode();
      } else {
        this.die();
        bullet.explode();
      }
    }
  }

  public fire(): boolean {
    if (this.bullets.length >= this.attributes.bulletMaxCount) {
      return;
    }

    const bullet = new Bullet(
      this.attributes.bulletSpeed,
      this.attributes.bulletTankDamage,
      this.attributes.bulletWallDamage,
    );

    // First, add bullet inside a tank and position it at the north center
    // of the tank (where the gun is). Bullet will inherit tank's rotation.
    this.add(bullet);
    bullet.updateWorldMatrix(true);
    bullet.setCenter(this.getSelfCenter());
    bullet.translateY(this.size.height / 2);

    // Then, detach bullet from a tank and move it to a field
    this.parent.attach(bullet);

    if (this.tags.includes(Tag.Player)) {
      bullet.tags.push(Tag.Player);
    } else if (this.tags.includes(Tag.Enemy)) {
      bullet.tags.push(Tag.Enemy);
    }

    this.bullets.push(bullet);

    bullet.died.addListener(() => {
      this.bullets = this.bullets.filter((tankBullet) => {
        return tankBullet !== bullet;
      });
    });

    return true;
  }

  public move(): void {
    if (this.state !== TankState.Moving) {
      this.state = TankState.Moving;
    }

    this.translateY(this.attributes.moveSpeed);
  }

  public idle(): void {
    if (this.state !== TankState.Idle) {
      this.state = TankState.Idle;
    }
  }

  public rotate(rotation: Rotation): this {
    // When tank is rotating align it to grid. It is needed to:
    // - simplify user navigation when moving into narrow passages; without it
    //   user will be stuck on corners
    const alignSize = config.TILE_SIZE_MEDIUM;
    if (rotation === Rotation.Up || rotation === Rotation.Down) {
      const alignedTileIndexX = Math.round(this.position.x / alignSize);
      const nextX = alignedTileIndexX * alignSize;
      this.position.setX(nextX);
    } else if (rotation === Rotation.Left || rotation === Rotation.Right) {
      const alignedTileIndexY = Math.round(this.position.y / alignSize);
      const nextY = alignedTileIndexY * alignSize;
      this.position.setY(nextY);
    }

    super.rotate(rotation);

    return this;
  }

  public die(reason: TankDeathReason = TankDeathReason.Bullet): void {
    this.died.notify({ reason });
  }

  public activateShield(duration: number): void {
    if (this.shield !== null) {
      this.shield.removeSelf();
      this.shieldTimer.stop();
      this.shield = null;
    }

    this.shield = new Shield();
    this.shield.setCenter(this.getSelfCenter());

    this.add(this.shield);

    this.shieldTimer.reset(duration);
  }

  private handleShieldTimer = (): void => {
    this.shield.removeSelf();
    this.shield = null;
  };
}
