import {
  Animation,
  GameObject,
  GameObjectUpdateArgs,
  Rotation,
  Sprite,
  SpriteMaterial,
  Subject,
  Vector,
} from '../core';
import { Behavior, StandStillBehavior } from '../behaviors';
import { TankSkin } from '../TankSkin';

import { Bullet } from './Bullet';
import { Shield } from './Shield';
import { Tag } from '../Tag';

import { TankExplosion } from './TankExplosion';

export enum TankState {
  Uninitialized,
  Idle,
  Moving,
}

export class Tank extends GameObject {
  public collider = true;
  public material: SpriteMaterial = new SpriteMaterial();
  public behavior: Behavior = new StandStillBehavior();
  public tags = [Tag.Tank];
  public bullet: Bullet = null;
  public shield: Shield = null;
  public died = new Subject();
  public skin: TankSkin;
  public state = TankState.Uninitialized;
  protected bulletDamage = 1;
  protected bulletSpeed = 10;
  protected speed = 2;
  protected health = 1;
  protected animation: Animation<Sprite>;

  constructor(width: number, height: number) {
    super(width, height);

    // TODO: tank is not rendered when constructed, only on update
    //       (field initializers)
    // this.skin.hasDrop = true;
    // this.skin.rotation = this.rotation;
    // this.animation = this.skin.createIdleAnimation();
  }

  public update(updateArgs: GameObjectUpdateArgs): void {
    this.behavior.update(this, updateArgs);

    this.animation.animate();
    this.material.sprite = this.animation.getCurrentFrame();
  }

  public collide(target: GameObject): void {
    if (target.tags.includes(Tag.Wall)) {
      const wallBoundingBox = target.getWorldBoundingBox();
      const { width, height } = this.getComputedDimensions();
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
      if (target === this.bullet) {
        return;
      }

      // If tank has shield - swallow the bullet
      if (this.shield !== null) {
        bullet.nullify();
        return;
      }

      const nextHealth = this.health - bullet.damage;
      if (nextHealth > 0) {
        this.health = nextHealth;
        bullet.explode();
      } else {
        this.explode();
        bullet.explode();
      }
    }
  }

  public fire(): boolean {
    if (this.bullet !== null) {
      return false;
    }

    const bullet = new Bullet();

    const { width: bulletWidth, height: bulletHeight } = bullet.dimensions;

    const position = this.position.clone();
    const { width: tankWidth, height: tankHeight } = this.dimensions;

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
    bullet.speed = this.bulletSpeed;
    bullet.damage = this.bulletDamage;

    if (this.tags.includes(Tag.Player)) {
      bullet.tags.push(Tag.Player);
    } else if (this.tags.includes(Tag.Enemy)) {
      bullet.tags.push(Tag.Enemy);
    }

    this.bullet = bullet;

    bullet.died.addListener(() => {
      this.bullet = null;
    });

    this.parent.add(bullet);

    return true;
  }

  public move(): void {
    if (this.state !== TankState.Moving) {
      this.state = TankState.Moving;
      this.animation = this.skin.createMoveAnimation();
    }

    if (this.rotation === Rotation.Up) {
      this.position.y -= this.speed;
    } else if (this.rotation === Rotation.Down) {
      this.position.y += this.speed;
    } else if (this.rotation === Rotation.Right) {
      this.position.x += this.speed;
    } else if (this.rotation === Rotation.Left) {
      this.position.x -= this.speed;
    }

    // const animation = this.animationMap[this.rotation];
    // animation.animate();
    // this.material.sprite = animation.getCurrentFrame();
  }

  public idle(): void {
    if (this.state !== TankState.Idle) {
      this.state = TankState.Idle;
      this.animation = this.skin.createIdleAnimation();
    }
  }

  public rotate(rotation: Rotation): this {
    if (this.rotation !== rotation) {
      this.skin.rotation = rotation;
      if (this.state === TankState.Moving) {
        this.animation = this.skin.createMoveAnimation();
      } else {
        this.animation = this.skin.createIdleAnimation();
      }
    }

    super.rotate(rotation);

    return this;
  }

  public explode(): void {
    const tankExplosion = new TankExplosion();
    tankExplosion.setCenterFrom(this);
    tankExplosion.completed.addListener(() => {
      tankExplosion.removeSelf();
    });
    this.replaceSelf(tankExplosion);
    this.died.notify();
  }
}
