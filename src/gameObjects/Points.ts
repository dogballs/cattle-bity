import { GameObject, SpriteRenderer, Timer } from '../core';
import { PointsValue } from '../points';
import { SpriteFactory } from '../sprite/SpriteFactory';

const SPRITE_POINTS_PREFIX = 'points';
const SPRITE_ID_SEPARATOR = '.';

export class Points extends GameObject {
  public readonly value: PointsValue;
  public readonly renderer = new SpriteRenderer();
  private readonly timer = new Timer();

  constructor(value: PointsValue, duration: number) {
    super(56, 28);

    this.value = value;

    const spriteId = this.getSpriteId(this.value);
    this.renderer.sprite = SpriteFactory.asOne(spriteId);

    this.timer.reset(duration);
    this.timer.done.addListener(this.handleTimer);
  }

  public update(): void {
    this.timer.tick();
  }

  private handleTimer = (): void => {
    this.removeSelf();
  };

  private getSpriteId(value: PointsValue): string {
    const parts = [SPRITE_POINTS_PREFIX, value.toString()];
    const spriteId = parts.join(SPRITE_ID_SEPARATOR);
    return spriteId;
  }
}