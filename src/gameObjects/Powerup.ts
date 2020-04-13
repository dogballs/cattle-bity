import {
  Animation,
  BoxCollider,
  Collision,
  GameObject,
  Sprite,
  SpritePainter,
  Subject,
} from '../core';
import { GameUpdateArgs, Tag } from '../game';
import { PowerupType } from '../powerup';

export class Powerup extends GameObject {
  public zIndex = 6;
  public collider = new BoxCollider(this, true);
  public painter = new SpritePainter();
  public ignorePause = true;
  public picked = new Subject();
  public type: PowerupType;
  private animation: Animation<Sprite>;

  constructor(type: PowerupType) {
    super(64, 64);

    this.type = type;
  }

  protected setup({ collisionSystem, spriteLoader }: GameUpdateArgs): void {
    collisionSystem.register(this.collider);

    const spriteId = this.getSpriteId();
    // Null as a second frame adds a blink effect
    const frames = [spriteLoader.load(spriteId), null];
    this.animation = new Animation(frames, {
      delay: 0.12,
      loop: true,
    });
  }

  protected update(updateArgs: GameUpdateArgs): void {
    this.collider.update();

    this.animation.update(updateArgs.deltaTime);
    this.painter.sprite = this.animation.getCurrentFrame();
  }

  protected collide(collision: Collision): void {
    const playerTankContacts = collision.contacts.filter((contact) => {
      return (
        contact.collider.object.tags.includes(Tag.Tank) &&
        contact.collider.object.tags.includes(Tag.Player)
      );
    });

    if (playerTankContacts.length > 0) {
      this.removeSelf();
      this.picked.notify(null);
      this.collider.unregister();
    }
  }

  private getSpriteId(): string {
    switch (this.type) {
      case PowerupType.BaseDefence:
        return 'powerup.shovel';
      case PowerupType.Freeze:
        return 'powerup.clock';
      case PowerupType.Life:
        return 'powerup.tank';
      case PowerupType.Shield:
        return 'powerup.helmet';
      case PowerupType.Upgrade:
        return 'powerup.star';
      case PowerupType.Wipeout:
        return 'powerup.grenade';
    }
    return 'unknown';
  }
}
