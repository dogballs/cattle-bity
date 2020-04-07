import {
  Animation,
  Collider,
  Collision,
  GameObject,
  Sprite,
  SpritePainter,
  Subject,
} from '../core';
import { GameUpdateArgs, Tag } from '../game';
import { PowerupType } from '../powerups';

export class Powerup extends GameObject {
  public zIndex = 6;
  public collider = new Collider(true);
  public painter = new SpritePainter();
  public ignorePause = true;
  public picked = new Subject();
  public type: PowerupType;
  private animation: Animation<Sprite>;

  constructor(type: PowerupType) {
    super(64, 64);

    this.type = type;
  }

  protected setup({ spriteLoader }: GameUpdateArgs): void {
    const spriteId = this.getSpriteId();
    // Null as a second frame adds a blink effect
    const frames = [spriteLoader.load(spriteId), null];
    this.animation = new Animation(frames, {
      delay: 0.12,
      loop: true,
    });
  }

  protected update(updateArgs: GameUpdateArgs): void {
    this.animation.update(updateArgs.deltaTime);
    this.painter.sprite = this.animation.getCurrentFrame();
  }

  protected collide({ other }: Collision): void {
    if (other.tags.includes(Tag.Player)) {
      this.removeSelf();
      this.picked.notify(null);
    }
  }

  private getSpriteId(): string {
    switch (this.type) {
      case PowerupType.BaseDefence:
        return 'powerup.shovel';
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
