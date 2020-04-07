import {
  Alignment,
  Animation,
  Collider,
  Collision,
  GameObject,
  SpritePainter,
  Subject,
  Timer,
} from '../core';
import { GameUpdateArgs, Rotation, Tag } from '../game';
import {
  TankAnimationFrame,
  TankAttributes,
  TankAttributesFactory,
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

const SKIN_LAYER_DESCRIPTIONS = [{ opacity: 1 }, { opacity: 0.5 }];

export class Tank extends GameObject {
  public collider = new Collider(true);
  public tags = [Tag.Tank];
  public zIndex = 1;
  public type: TankType;
  public attributes: TankAttributes;
  public behavior: TankBehavior;
  public skinAnimation: TankSkinAnimation;
  public bullets: Bullet[] = [];
  public shield: Shield = null;
  public died = new Subject<{ reason: TankDeathReason }>();
  public hit = new Subject();
  public state = TankState.Uninitialized;
  protected shieldTimer = new Timer();
  protected animation: Animation<TankAnimationFrame>;
  protected skinLayers: GameObject[] = [];

  constructor(type: TankType) {
    super(64, 64);

    this.pivot.set(0.5, 0.5);

    this.type = type;

    this.attributes = TankAttributesFactory.create(this.type);

    this.shieldTimer.done.addListener(this.handleShieldTimer);
  }

  protected setup(updateArgs: GameUpdateArgs): void {
    this.behavior.setup(this, updateArgs);

    SKIN_LAYER_DESCRIPTIONS.forEach(() => {
      const layer = new GameObject();
      layer.size.copyFrom(this.size);

      const painter = new SpritePainter();
      painter.alignment = Alignment.MiddleCenter;

      layer.painter = painter;

      this.skinLayers.push(layer);

      this.add(layer);
    });
  }

  protected update(updateArgs: GameUpdateArgs): void {
    this.shieldTimer.update(updateArgs.deltaTime);

    this.behavior.update(this, updateArgs);

    this.skinAnimation.update(this, updateArgs.deltaTime);

    const frame = this.skinAnimation.getCurrentFrame();

    this.skinLayers.forEach((layer, index) => {
      const description = SKIN_LAYER_DESCRIPTIONS[index];

      const painter = layer.painter as SpritePainter;
      const sprite = frame.getSprite(index);

      painter.opacity = description.opacity;
      painter.sprite = sprite;
    });
  }

  protected collide({ other }: Collision): void {
    if (other.tags.includes(Tag.BlockMove)) {
      const selfWorldBox = this.getWorldBoundingBox();
      const otherWorldBox = other.getWorldBoundingBox();

      // TODO: rework after collisions, because now we are tied to axis
      const rotation = this.getWorldRotation();

      // Fix overlap during collision
      if (rotation === Rotation.Up) {
        this.translateY(selfWorldBox.min.y - otherWorldBox.max.y);
      } else if (rotation === Rotation.Down) {
        this.translateY(otherWorldBox.min.y - selfWorldBox.max.y);
      } else if (rotation === Rotation.Left) {
        this.translateY(selfWorldBox.min.x - otherWorldBox.max.x);
      } else if (rotation === Rotation.Right) {
        this.translateY(otherWorldBox.min.x - selfWorldBox.max.x);
      }

      // If it collides with multiple brick at a time, each of them will
      // invoke translation above, matrix is updated
      this.updateWorldMatrix();
    }

    if (other.tags.includes(Tag.Bullet)) {
      const bullet = other as Bullet;

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

      bullet.explode();

      this.receiveHit(bullet.tankDamage);
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

  public move(deltaTime: number): void {
    if (this.state !== TankState.Moving) {
      this.state = TankState.Moving;
    }

    this.translateY(this.attributes.moveSpeed * deltaTime);
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

  public isAlive(): boolean {
    return this.attributes.health > 0;
  }

  protected receiveHit(damage: number): void {
    this.attributes.health = Math.max(0, this.attributes.health - damage);

    this.hit.notify(null);

    if (!this.isAlive()) {
      this.die();
    }
  }

  private handleShieldTimer = (): void => {
    this.shield.removeSelf();
    this.shield = null;
  };
}
