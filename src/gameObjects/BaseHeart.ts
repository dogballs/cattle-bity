import {
  BoxCollider,
  Collision,
  GameObject,
  Sprite,
  SpritePainter,
  Subject,
} from '../core';
import { GameUpdateArgs, Tag } from '../game';
import { Bullet, Explosion } from '../gameObjects';
import * as config from '../config';

export class BaseHeart extends GameObject {
  public collider = new BoxCollider(this, true);
  public tags = [Tag.BlockMove];
  public painter = new SpritePainter();
  public zIndex = config.BASE_HEART_Z_INDEX;
  public died = new Subject();
  private isDead = false;
  private aliveSprite: Sprite;
  private deadSprite: Sprite;

  constructor() {
    super(64, 64);
  }

  public explode(): void {
    if (this.isDead) {
      return;
    }

    this.isDead = true;

    const explosion = new Explosion();
    explosion.updateMatrix();
    explosion.setCenter(this.getSelfCenter());
    this.add(explosion);

    this.painter.sprite = this.deadSprite;

    this.died.notify(null);
  }

  protected setup({ collisionSystem, spriteLoader }: GameUpdateArgs): void {
    collisionSystem.register(this.collider);

    this.aliveSprite = spriteLoader.load('base.heart.alive');
    this.deadSprite = spriteLoader.load('base.heart.dead');

    this.painter.sprite = this.aliveSprite;
  }

  protected update(): void {
    this.collider.update();
  }

  protected collide(collision: Collision): void {
    // If dead, don't collide with bullets, but they can still pass through
    if (this.isDead) {
      return;
    }

    const bulletContacts = collision.contacts.filter((contact) => {
      return contact.collider.object.tags.includes(Tag.Bullet);
    });

    if (bulletContacts.length > 0) {
      const firstBulletContact = bulletContacts[0];
      const bullet = firstBulletContact.collider.object as Bullet;

      bullet.explode();
      this.explode();
    }
  }
}
