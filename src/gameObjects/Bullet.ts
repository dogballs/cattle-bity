import { GameObject, Rotation, SpriteMaterial } from './../core';
import { SpriteFactory, MapNameToSprite } from '../sprite/SpriteFactory';
import { BrickWallDestroyer } from './BrickWallDestroyer';
import { BulletExplosion } from './BulletExplosion';
import { Tag } from './Tag';

export class Bullet extends GameObject {
  public collider = true;
  public damage = 0;
  public speed = 15;
  public tags = [Tag.Bullet];
  private spriteMap: MapNameToSprite;

  constructor() {
    super(12, 16);

    this.spriteMap = SpriteFactory.asMap({
      [Rotation.Up]: 'bullet.up',
      [Rotation.Down]: 'bullet.down',
      [Rotation.Left]: 'bullet.left',
      [Rotation.Right]: 'bullet.right',
    });

    this.material = new SpriteMaterial();
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

    this.material.sprite = this.spriteMap[this.rotation];
  }

  public collide(target: GameObject): void {
    const isWall = target.tags.includes(Tag.Wall);
    const isBrickWall = isWall && target.tags.includes(Tag.Brick);
    // const isEnemyTank =
    // target.tags.includes(Tag.Tank) && target.tags.includes(Tag.Enemy);

    if (isBrickWall) {
      const destroyer = new BrickWallDestroyer();
      // TODO: order here matters
      destroyer.rotate(this.rotation);
      destroyer.setCenterFrom(this);
      this.parent.add(destroyer);
    }

    if (isWall) {
      const bulletExplosion = new BulletExplosion();
      bulletExplosion.setCenterFrom(this);
      bulletExplosion.onComplete = (): void => {
        bulletExplosion.removeSelf();
      };
      this.replaceSelf(bulletExplosion);
      this.emit('died');
    }
  }
}
