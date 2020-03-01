import { GameObject, Sound, Sprite, SpriteRenderer, Subject } from '../core';
import { GameObjectUpdateArgs, Tag } from '../game';
import { Bullet, Explosion } from '../gameObjects';

export class BaseHeart extends GameObject {
  public collider = true;
  // Tank can't move on top of it
  public tags = [Tag.BlockMove];
  public renderer = new SpriteRenderer();
  public readonly died = new Subject();
  private isDead = false;
  private aliveSprite: Sprite;
  private deadSprite: Sprite;
  private explosionSound: Sound;

  constructor() {
    super(64, 64);
  }

  public explode(): void {
    if (this.isDead) {
      return;
    }

    this.isDead = true;

    const explosion = new Explosion();
    explosion.setCenter(this.getChildrenCenter());
    this.add(explosion);

    this.renderer.sprite = this.deadSprite;

    this.explosionSound.play();

    this.died.notify();
  }

  protected setup({ audioLoader, spriteLoader }: GameObjectUpdateArgs): void {
    this.aliveSprite = spriteLoader.load('base.heart.alive');
    this.deadSprite = spriteLoader.load('base.heart.dead');

    this.explosionSound = audioLoader.load('explosion.player');

    this.renderer.sprite = this.aliveSprite;
  }

  protected collide(target: GameObject): void {
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
