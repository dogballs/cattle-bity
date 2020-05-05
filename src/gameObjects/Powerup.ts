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
import * as config from '../config';

import { PlayerTank } from './PlayerTank';

const PICKUP_MIN_INTERSECTION_SIZE = 16;

export class Powerup extends GameObject {
  public zIndex = config.POWERUP_Z_INDEX;
  public collider = new BoxCollider(this, true);
  public painter = new SpritePainter();
  public ignorePause = true;
  public picked = new Subject<{ playerIndex: number }>();
  public type: PowerupType;
  private animation: Animation<Sprite>;

  constructor(type: PowerupType) {
    super(64, 64);

    this.type = type;
  }

  public destroy(): void {
    this.dirtyPaintBox();
    this.removeSelf();
    this.collider.unregister();
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
    this.setNeedsPaint();
  }

  protected collide(collision: Collision): void {
    const playerTankContacts = collision.contacts.filter((contact) => {
      return (
        contact.collider.object.tags.includes(Tag.Tank) &&
        contact.collider.object.tags.includes(Tag.Player)
      );
    });

    if (playerTankContacts.length > 0) {
      const firstPlayerTankContact = playerTankContacts[0];
      const tankBox = firstPlayerTankContact.collider.getBox();
      const selfBox = this.collider.getBox();

      // Fixes the issue that tank can pick up powerup with his collision box
      // even though tank is visually not exactly touching the powerup.
      // Calculate minimum intersection area in order for powerup to get
      // picked up.

      const intersectionBox = selfBox.clone().intersectWith(tankBox);
      const intersectionRect = intersectionBox.toRect();

      if (
        intersectionRect.width > PICKUP_MIN_INTERSECTION_SIZE &&
        intersectionRect.height > PICKUP_MIN_INTERSECTION_SIZE
      ) {
        const tank = firstPlayerTankContact.collider.object as PlayerTank;
        const { playerIndex } = tank;

        this.destroy();
        this.picked.notify({ playerIndex });
      }
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
