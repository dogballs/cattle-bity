import { GameObject, SpritePainter, Timer } from '../core';
import { GameUpdateArgs } from '../game';
import { PointsValue } from '../points';
import * as config from '../config';

const SPRITE_POINTS_PREFIX = 'points';
const SPRITE_ID_SEPARATOR = '.';

export class Points extends GameObject {
  public zIndex = config.POINTS_Z_INDEX;
  public readonly value: PointsValue;
  public readonly painter = new SpritePainter();
  private readonly timer = new Timer();

  constructor(value: PointsValue, duration: number) {
    super(56, 28);

    this.value = value;

    this.timer.reset(duration);
    this.timer.done.addListener(this.handleTimer);
  }

  protected setup({ spriteLoader }: GameUpdateArgs): void {
    const spriteId = this.getSpriteId(this.value);
    this.painter.sprite = spriteLoader.load(spriteId);
  }

  protected update(updateArgs: GameUpdateArgs): void {
    this.timer.update(updateArgs.deltaTime);
  }

  private handleTimer = (): void => {
    this.dirtyPaintBox();
    this.removeSelf();
  };

  private getSpriteId(value: PointsValue): string {
    const parts = [SPRITE_POINTS_PREFIX, value.toString()];
    const spriteId = parts.join(SPRITE_ID_SEPARATOR);
    return spriteId;
  }
}
