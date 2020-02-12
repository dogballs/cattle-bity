import { GameObject, SpriteMaterial, Subject } from '../core';
import { Bullet, Explosion } from '../gameObjects';
import { AudioManager } from '../audio/AudioManager';
import { SpriteFactory } from '../sprite/SpriteFactory';
import { Tag } from '../Tag';

export class BaseHeart extends GameObject {
  public collider = true;
  // Tank can't move on top of it
  public tags = [Tag.BlockMove];
  public material = new SpriteMaterial();
  public readonly died = new Subject();
  private isDead = false;
  private explosionSound = AudioManager.load('explosion.player');

  constructor() {
    super(64, 64);

    this.material.sprite = SpriteFactory.asOne('base.heart.alive');
  }

  public explode(): void {
    if (this.isDead) {
      return;
    }

    this.isDead = true;

    const explosion = new Explosion();
    explosion.setCenter(this.getChildrenCenter());
    this.add(explosion);

    this.material.sprite = SpriteFactory.asOne('base.heart.dead');

    this.explosionSound.play();

    this.died.notify();
  }

  public collide(target: GameObject): void {
    // If dead, don't collide with bullets, but they can still pass through
    if (this.isDead) {
      return;
    }

    if (target.tags.includes(Tag.Bullet)) {
      const bullet = target as Bullet;
      bullet.explode();
      this.explode();
    }
  }
}
