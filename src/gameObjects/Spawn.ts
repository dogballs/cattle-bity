import {
  Alignment,
  Animation,
  GameObject,
  Sprite,
  SpritePainter,
  Subject,
} from '../core';
import { GameObjectUpdateArgs } from '../game';

export class Spawn extends GameObject {
  public painter = new SpritePainter();
  public completed = new Subject();
  private animation: Animation<Sprite>;

  constructor() {
    super(64, 64);

    this.painter.alignment = Alignment.MiddleCenter;
  }

  protected setup({ spriteLoader }: GameObjectUpdateArgs): void {
    this.animation = new Animation(
      spriteLoader.loadList(['spawn.1', 'spawn.2', 'spawn.3', 'spawn.4']),
      { delay: 0.05, loop: 3 },
    );
  }

  protected update({ deltaTime }: GameObjectUpdateArgs): void {
    if (this.animation.isComplete()) {
      this.completed.notify();
      return;
    }

    this.animation.update(deltaTime);
    this.painter.sprite = this.animation.getCurrentFrame();
  }
}
