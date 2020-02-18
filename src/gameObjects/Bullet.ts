import { GameObject, Rotation, SpriteRenderer, Subject } from '../core';
import { AudioManager } from '../audio/AudioManager';
import { SpriteFactory, MapNameToSprite } from '../sprite/SpriteFactory';
import { Tag } from '../Tag';

import { SmallExplosion } from './SmallExplosion';
import { WallDestroyer } from './WallDestroyer';

export class Bullet extends GameObject {
  public collider = true;
  public tankDamage: number;
  public wallDamage: number;
  public speed: number;
  public tags = [Tag.Bullet];
  public died = new Subject();
  public renderer = new SpriteRenderer();
  private spriteMap: MapNameToSprite;

  constructor(speed: number, tankDamage: number, wallDamage: number) {
    super(12, 16);

    this.speed = speed;
    this.tankDamage = tankDamage;
    this.wallDamage = wallDamage;

    this.spriteMap = SpriteFactory.asMap({
      [Rotation.Up]: 'bullet.up',
      [Rotation.Down]: 'bullet.down',
      [Rotation.Left]: 'bullet.left',
      [Rotation.Right]: 'bullet.right',
    });
  }

  public update(): void {
    if (this.rotation === Rotation.Up) {
      this.position.y -= this.speed;
    } else if (this.rotation === Rotation.Down) {
      this.position.y += this.speed;
    } else if (this.rotation === Rotation.Left) {
      this.position.x -= this.speed;
    } else if (this.rotation === Rotation.Right) {
      this.position.x += this.speed;
    }

    this.renderer.sprite = this.spriteMap[this.rotation];
  }

  public collide(target: GameObject): void {
    if (target.tags.includes(Tag.Bullet)) {
      const bullet = target as Bullet;

      // Enemy bullets don't discard each other, they pass thru
      if (bullet.tags.includes(Tag.Enemy) && this.tags.includes(Tag.Enemy)) {
        return;
      }

      // When player bullet hits enemy bullet, they dissappear
      this.nullify();
      bullet.nullify();

      return;
    }

    const isWall = target.tags.includes(Tag.Wall);
    const isBrickWall = isWall && target.tags.includes(Tag.Brick);
    const isBorderWall = isWall && target.tags.includes(Tag.Border);
    const isSteelWall = isWall && target.tags.includes(Tag.Steel);

    if (isWall) {
      this.explode();
    }

    if (isBrickWall || (isSteelWall && this.wallDamage === 2)) {
      const wallWorldBox = target.getWorldBoundingBox();

      const destroyer = new WallDestroyer(this.wallDamage);
      // TODO: order here matters
      destroyer.rotate(this.rotation);
      destroyer.setCenterFrom(this);

      // At this point destroyer is aligned by at the main axis, i.e.
      // if bullet rotation is left/right - destroyer is aligned at "y";
      // if bullet rotation is up/down - destroyer is aligned at "x".
      // What is left is to fix counterpart axis.

      // TODO: order matters
      // TODO: these world positions are very messy, but are required to be
      // able to hit bricks in base

      // Adding to parent will influence in world position calculation
      this.parent.add(destroyer);
      const destroyerWorldPosition = destroyer.getWorldPosition();
      const destroyerSize = destroyer.getComputedSize();

      if (this.rotation === Rotation.Up) {
        destroyer.setWorldPosition(
          destroyerWorldPosition
            .clone()
            .setY(wallWorldBox.max.y - destroyerSize.height),
        );
      } else if (this.rotation === Rotation.Down) {
        destroyer.setWorldPosition(
          destroyerWorldPosition.clone().setY(wallWorldBox.min.y),
        );
      } else if (this.rotation === Rotation.Left) {
        destroyer.setWorldPosition(
          destroyerWorldPosition
            .clone()
            .setX(wallWorldBox.max.x - destroyerSize.width),
        );
      } else if (this.rotation === Rotation.Right) {
        destroyer.setWorldPosition(
          destroyerWorldPosition.clone().setX(wallWorldBox.min.x),
        );
      }

      // TODO: it collides with multiple "bricks", multiple audio sources are
      // triggered
      // Only player bullets make sound
      if (this.tags.includes(Tag.Player)) {
        AudioManager.load('hit.brick').play();
      }
    } else if (isSteelWall || isBorderWall) {
      // TODO: when tank is grade 4, it can destroy steel walls, and in that
      // case they make the same sound as brick walls
      // Only player bullets make sound
      if (this.tags.includes(Tag.Player)) {
        AudioManager.load('hit.steel').play();
      }
    }
  }

  public nullify(): void {
    this.removeSelf();
    this.died.notify();
  }

  public explode(): void {
    const explosion = new SmallExplosion();
    explosion.setCenterFrom(this);
    this.replaceSelf(explosion);
    this.died.notify();
  }
}
