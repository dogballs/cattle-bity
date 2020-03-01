import {
  Alignment,
  Animation,
  GameObject,
  Rotation,
  Sprite,
  SpriteRenderer,
  Subject,
  Timer,
} from '../core';
import { GameObjectUpdateArgs, Tag } from '../game';
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
      const targetBox = target.getWorldBoundingBox();
      const { width, height } = this.getBoundingBox().getSize();
      const worldPosition = this.getWorldPosition();

      // TODO: world positions are messy, but required to check for all walls
      // for whatever nesting levels.
      // Fix tank position depending on what wall he hits, so the tank won't be
      // able to pass thru the wall.
      if (this.rotation === Rotation.Up) {
        this.setWorldPosition(worldPosition.clone().setY(targetBox.max.y));
      } else if (this.rotation === Rotation.Down) {
        this.setWorldPosition(
          worldPosition.clone().setY(targetBox.min.y - height),
        );
      } else if (this.rotation === Rotation.Left) {
        this.setWorldPosition(worldPosition.clone().setX(targetBox.max.x));
      } else if (this.rotation === Rotation.Right) {
        this.setWorldPosition(
          worldPosition.clone().setX(targetBox.min.x - width),
        );
      }
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

    const tankSize = this.getBoundingBox().getSize();

    // Position bullet where the gun is

    // TODO: order here matters
    bullet.rotate(this.rotation);
    bullet.setCenterFrom(this);

    // Get after rotation
    const bulletSize = bullet.getBoundingBox().getSize();

    if (this.rotation === Rotation.Up) {
      bullet.position.setY(this.position.y);
    } else if (this.rotation === Rotation.Down) {
      bullet.position.setY(
        this.position.y + tankSize.height - bulletSize.height,
      );
    } else if (this.rotation === Rotation.Left) {
      bullet.position.setX(this.position.x);
    } else if (this.rotation === Rotation.Right) {
      bullet.position.setX(this.position.x + tankSize.width - bulletSize.width);
    }

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

    this.parent.add(bullet);

    return true;
  }

  public move(): void {
    if (this.state !== TankState.Moving) {
      this.state = TankState.Moving;
    }

    if (this.rotation === Rotation.Up) {
      this.position.y -= this.attributes.moveSpeed;
    } else if (this.rotation === Rotation.Down) {
      this.position.y += this.attributes.moveSpeed;
    } else if (this.rotation === Rotation.Right) {
      this.position.x += this.attributes.moveSpeed;
    } else if (this.rotation === Rotation.Left) {
      this.position.x -= this.attributes.moveSpeed;
    }
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
    this.shield.setCenter(this.getChildrenCenter());

    this.add(this.shield);

    this.shieldTimer.reset(duration);
  }

  private handleShieldTimer = (): void => {
    this.shield.removeSelf();
    this.shield = null;
  };
}
