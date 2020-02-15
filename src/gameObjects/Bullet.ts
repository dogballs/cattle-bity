import { GameObject, Rotation, SpriteRenderer, Subject } from '../core';
import { AudioManager } from '../audio/AudioManager';
import { SpriteFactory, MapNameToSprite } from '../sprite/SpriteFactory';
import { Tag } from '../Tag';

import { BrickWallDestroyer } from './BrickWallDestroyer';
import { BulletExplosion } from './BulletExplosion';

export class Bullet extends GameObject {
  public collider = true;
  public damage = 0;
  public speed = 15;
  public tags = [Tag.Bullet];
  public died = new Subject();
  public renderer = new SpriteRenderer();
  private spriteMap: MapNameToSprite;

  constructor() {
    super(12, 16);

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

    if (isBrickWall) {
      const destroyer = new BrickWallDestroyer();
      // TODO: order here matters
      destroyer.rotate(this.rotation);
      destroyer.setCenterFrom(this);
      this.parent.add(destroyer);

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
    const bulletExplosion = new BulletExplosion();
    bulletExplosion.setCenterFrom(this);
    bulletExplosion.completed.addListener(() => {
      bulletExplosion.removeSelf();
    });
    this.replaceSelf(bulletExplosion);
    this.died.notify();
  }
}
