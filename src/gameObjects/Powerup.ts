import {
  Animation,
  AudioSource,
  GameObject,
  Sprite,
  SpriteMaterial,
  Subject,
} from '../core';
import { AudioManager } from '../audio/AudioManager';
import { SpriteFactory } from '../sprite/SpriteFactory';
import { Tag } from '../Tag';
import { PowerupAction } from '../powerups';

export class Powerup extends GameObject {
  public collider = true;

  // Powerup should be blinking during pause
  public ignorePause = true;

  public readonly picked = new Subject();

  // Action to perform when picked up
  public readonly action: PowerupAction;

  public readonly pickupSound: AudioSource;

  public material = new SpriteMaterial();
  private animation: Animation<Sprite>;

  constructor(action: PowerupAction, spriteId: string, pickupSoundId: string) {
    super(64, 64);

    this.action = action;

    // TODO: should resource be loaded in constructor?
    this.pickupSound = AudioManager.load(pickupSoundId);

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
      this.picked.notify();
      // TODO: seems like not the best place
      this.pickupSound.play();
    }
  }
}
