import {
  Animation,
  GameObject,
  KeyboardInput,
  Rotation,
  Sprite,
  SpriteMaterial,
  Vector,
} from '../core';
import { Strategy, StandStillStrategy } from '../strategy';

import { Bullet } from './Bullet';
import { Tag } from './Tag';
import { TankExplosion } from './TankExplosion';

export class Tank extends GameObject {
  public collider = true;
  public material: SpriteMaterial = new SpriteMaterial();
  public strategy: Strategy = new StandStillStrategy();
  public tags = [Tag.Tank];
  public bullet: Bullet = null;
  protected bulletDamage = 1;
  protected bulletSpeed = 10;
  protected speed = 2;
  protected health = 1;
  protected animations: Map<Rotation, Animation<Sprite>> = new Map();

  public update({ input }: { input: KeyboardInput }): void {
    this.strategy.update(this, input);
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
      // Prevent self-destruction
      if (target === this.bullet) {
        return;
      }

      const bullet = target as Bullet;
      const nextHealth = this.health - bullet.damage;
      if (nextHealth > 0) {
        this.health = nextHealth;
      } else {
        const tankExplosion = new TankExplosion();
        tankExplosion.setCenterFrom(this);
        tankExplosion.on('completed', () => {
          tankExplosion.removeSelf();
        });
        this.replaceSelf(tankExplosion);
      }
    }
  }

  public fire(): void {
    if (this.bullet !== null) {
      return;
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

    bullet.on('died', () => {
      this.bullet = null;
    });

    this.bullet = bullet;

    this.parent.add(bullet);
  }

  public move(): void {
    if (this.rotation === Rotation.Up) {
      this.position.y -= this.speed;
    } else if (this.rotation === Rotation.Down) {
      this.position.y += this.speed;
    } else if (this.rotation === Rotation.Right) {
      this.position.x += this.speed;
    } else if (this.rotation === Rotation.Left) {
      this.position.x -= this.speed;
    }

    const animation = this.animations.get(this.rotation);
    if (animation !== undefined) {
      this.material.sprite = animation.getCurrentFrame();
    }
  }
}
