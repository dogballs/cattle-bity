import {
  Animation,
  GameObject,
  GameObjectUpdateArgs,
  Rotation,
  Sprite,
  SpriteAlignment,
  SpriteRenderer,
  Subject,
  Timer,
  Vector,
} from '../core';
import { TankAttributes, TankBehavior, TankSkin } from '../tank';
import { Tag } from '../Tag';
import * as config from '../config';

import { Bullet } from './Bullet';
import { Explosion } from './Explosion';
import { Shield } from './Shield';

export enum TankState {
  Uninitialized,
  Idle,
  Moving,
}

export class Tank extends GameObject {
  public attributes: TankAttributes;
  public behavior: TankBehavior;
  public skin: TankSkin;
  public collider = true;
  public tags = [Tag.Tank];
  public bullets: Bullet[] = [];
  public shield: Shield = null;
  public died = new Subject();
  public state = TankState.Uninitialized;
  public renderer: SpriteRenderer = new SpriteRenderer();
  protected shieldTimer = new Timer();
  protected animation: Animation<Sprite>;

  constructor(
    width: number,
    height: number,
    attributes: TankAttributes,
    behavior: TankBehavior,
    skin: TankSkin,
  ) {
    super(width, height);

    this.attributes = attributes;
    this.behavior = behavior;
    this.skin = skin;

    this.renderer.alignment = SpriteAlignment.Center;
    this.renderer.sprite = this.skin.getCurrentFrame();

    this.shieldTimer.done.addListener(this.handleShieldTimer);
  }

  public update(updateArgs: GameObjectUpdateArgs): void {
    this.shieldTimer.tick();

    this.behavior.update(this, updateArgs);

    this.skin.update(this);

    this.renderer.sprite = this.skin.getCurrentFrame();
  }

  public collide(target: GameObject): void {
    if (target.tags.includes(Tag.BlockMove)) {
      const wallBoundingBox = target.getWorldBoundingBox();
      const { width, height } = this.getComputedSize();
      const worldPosition = this.getWorldPosition();

      // Fix tank position depending on what wall he hits, so the tank won't be
      // able to pass thru the wall.
      if (this.rotation === Rotation.Up) {
        this.setWorldPosition(
          worldPosition.clone().setY(wallBoundingBox.max.y),
        );
      } else if (this.rotation === Rotation.Down) {
        this.setWorldPosition(
          worldPosition.clone().setY(wallBoundingBox.min.y - height),
        );
      } else if (this.rotation === Rotation.Left) {
        this.setWorldPosition(
          worldPosition.clone().setX(wallBoundingBox.max.x),
        );
      } else if (this.rotation === Rotation.Right) {
        this.setWorldPosition(
          worldPosition.clone().setX(wallBoundingBox.min.x - width),
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

      const nextHealth = this.attributes.health - bullet.damage;
      if (nextHealth > 0) {
        this.attributes.health = nextHealth;
        bullet.explode();
      } else {
        this.explode();
        bullet.explode();
      }
    }
  }

  public fire(): boolean {
    if (this.bullets.length >= this.attributes.bulletMaxCount) {
      return;
    }

    const bullet = new Bullet();

    const { width: bulletWidth, height: bulletHeight } = bullet.size;

    const position = this.position.clone();
    const { width: tankWidth, height: tankHeight } = this.size;

    if (this.rotation === Rotation.Up) {
      position.add(new Vector(tankWidth / 2 - bulletWidth / 2, 0));
    } else if (this.rotation === Rotation.Down) {
      position.add(new Vector(tankWidth / 2 - bulletWidth / 2, tankHeight));
    } else if (this.rotation === Rotation.Left) {
      position.add(new Vector(0, tankHeight / 2 - bulletHeight / 2));
    } else if (this.rotation === Rotation.Right) {
      position.add(new Vector(tankWidth, tankHeight / 2 - bulletHeight / 2));
    }

    bullet.position = position;
    bullet.rotate(this.rotation);
    bullet.speed = this.attributes.bulletSpeed;
    bullet.damage = this.attributes.bulletDamage;

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

  public explode(): void {
    const explosion = new Explosion();
    explosion.setCenterFrom(this);
    this.replaceSelf(explosion);
    this.died.notify();
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
