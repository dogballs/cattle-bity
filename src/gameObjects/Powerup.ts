import {
  Animation,
  GameObject,
  Sound,
  Sprite,
  SpriteRenderer,
  Subject,
} from '../core';
import { GameObjectUpdateArgs, Tag } from '../game';
import { PowerupAction } from '../powerups';

export class Powerup extends GameObject {
  public collider = true;

  // Powerup should be blinking during pause
  public ignorePause = true;

  public readonly picked = new Subject();

  // Action to perform when picked up
  public readonly action: PowerupAction;

  private spriteId: string;
  private pickupSoundId: string;
  private pickupSound: Sound;

  public renderer = new SpriteRenderer();
  private animation: Animation<Sprite>;

  constructor(action: PowerupAction, spriteId: string, pickupSoundId: string) {
    super(64, 64);

    this.action = action;
    this.spriteId = spriteId;
    this.pickupSoundId = pickupSoundId;
  }

  protected setup({ audioLoader, spriteLoader }: GameObjectUpdateArgs): void {
    this.pickupSound = audioLoader.load(this.pickupSoundId);

    // Null as a second frame adds a blink effect
    const frames = [spriteLoader.load(this.spriteId), null];
    this.animation = new Animation(frames, {
      delay: 7,
      loop: true,
    });
  }

  protected update(): void {
    this.animation.animate();
    this.renderer.sprite = this.animation.getCurrentFrame();
  }

  protected collide(target: GameObject): void {
    if (target.tags.includes(Tag.Player)) {
      this.removeSelf();
      this.picked.notify();
      // TODO: seems like not the best place
      this.pickupSound.play();
    }
  }
}
