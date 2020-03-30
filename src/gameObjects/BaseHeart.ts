import {
  Collider,
  Collision,
  GameObject,
  Sound,
  Sprite,
  SpritePainter,
  Subject,
} from '../core';
import { GameObjectUpdateArgs, Tag } from '../game';
import { Bullet, Explosion } from '../gameObjects';

export class BaseHeart extends GameObject {
  public collider = new Collider(true);
  // Tank can't move on top of it
  public tags = [Tag.BlockMove];
  public painter = new SpritePainter();
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
    explosion.setCenter(this.getSelfCenter());
    this.add(explosion);

    this.painter.sprite = this.deadSprite;

    this.explosionSound.play();

    this.died.notify();
  }

  protected setup({ audioLoader, spriteLoader }: GameObjectUpdateArgs): void {
    this.aliveSprite = spriteLoader.load('base.heart.alive');
    this.deadSprite = spriteLoader.load('base.heart.dead');

    this.explosionSound = audioLoader.load('explosion.player');

    this.painter.sprite = this.aliveSprite;
  }

  protected collide({ other }: Collision): void {
    // If dead, don't collide with bullets, but they can still pass through
    if (this.isDead) {
      return;
    }

    if (other.tags.includes(Tag.Bullet)) {
      const bullet = other as Bullet;
      bullet.explode();
      this.explode();
    }
  }
}
