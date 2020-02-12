import { Animation, GameObject, Sprite, SpriteMaterial } from '../core';
import { PlayerTank } from '../gameObjects';
import { SpriteFactory } from '../sprite/SpriteFactory';
import { Tag } from '../Tag';
import { PowerupAction } from '../powerups';

export class Powerup extends GameObject {
  public collider = true;

  // Powerup should be blinking during pause
  public ignorePause = true;

  // Action to perform when picked up
  public readonly action: PowerupAction;

  public material = new SpriteMaterial();
  private animation: Animation<Sprite>;

  constructor(spriteId: string, action: PowerupAction) {
    super(64, 64);

    this.action = action;

    // Null as a second frame adds a blink effect
    const frames = [SpriteFactory.asOne(spriteId), null];
    this.animation = new Animation(frames, {
      delay: 7,
      loop: true,
    });
  }

  public update(): void {
    this.animation.animate();
    this.material.sprite = this.animation.getCurrentFrame();
  }

  public collide(target: GameObject): void {
    if (target.tags.includes(Tag.Player)) {
      this.removeSelf();
      this.action.execute(target as PlayerTank, this);
    }
  }
}
