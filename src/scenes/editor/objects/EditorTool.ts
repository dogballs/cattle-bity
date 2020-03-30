import {
  Collider,
  Collision,
  GameObject,
  RectPainter,
  Subject,
  Timer,
  Vector,
} from '../../../core';
import { GameObjectUpdateArgs, Tag } from '../../../game';
import {
  EditorInputContext,
  InputHoldThrottle,
  InputHoldThrottleOptions,
} from '../../../input';
import * as config from '../../../config';

import { EditorBrush } from './EditorBrush';

const BLINK_DELAY = 0.2;

const HOLD_THROTTLE_OPTIONS: InputHoldThrottleOptions = {
  activationDelay: 0.12,
  delay: 0.024,
};

export class EditorTool extends GameObject {
  public collider = new Collider(true);
  public painter = new RectPainter(null, config.COLOR_RED);
  public draw = new Subject();
  private brush: EditorBrush = null;
  private velocity = new Vector(0, 0);
  private holdThrottles: InputHoldThrottle[] = [];
  private blinkTimer = new Timer();
  private isBlinkVisible = true;

  constructor() {
    super();

    this.holdThrottles = [
      new InputHoldThrottle(
        EditorInputContext.MoveUp,
        this.moveUp,
        HOLD_THROTTLE_OPTIONS,
      ),
      new InputHoldThrottle(
        EditorInputContext.MoveDown,
        this.moveDown,
        HOLD_THROTTLE_OPTIONS,
      ),
      new InputHoldThrottle(
        EditorInputContext.MoveLeft,
        this.moveLeft,
        HOLD_THROTTLE_OPTIONS,
      ),
      new InputHoldThrottle(
        EditorInputContext.MoveRight,
        this.moveRight,
        HOLD_THROTTLE_OPTIONS,
      ),
    ];
  }

  public setBrush(brush: EditorBrush): void {
    this.brush = brush;

    this.size.copyFrom(brush.size);

    this.position.x -= this.position.x % this.size.width;
    this.position.y -= this.position.y % this.size.height;

    this.removeAllChildren();
    this.add(this.brush);
  }

  public getBrush(): EditorBrush {
    return this.brush;
  }

  protected update(updateArgs: GameObjectUpdateArgs): void {
    this.updatePosition(updateArgs);
    this.updateBlinking(updateArgs);

    const { input } = updateArgs;

    if (input.isDownAny(EditorInputContext.Draw)) {
      this.draw.notify();
    }
  }

  protected collide(collision: Collision): void {
    const { other } = collision;

    if (other.tags.includes(Tag.BlockMove)) {
      this.position.sub(this.velocity);
    }
  }

  private updatePosition({ deltaTime, input }: GameObjectUpdateArgs): void {
    this.velocity.set(0, 0);

    if (input.isDownAny(EditorInputContext.MoveUp)) {
      this.moveUp();
    } else if (input.isDownAny(EditorInputContext.MoveDown)) {
      this.moveDown();
    } else if (input.isDownAny(EditorInputContext.MoveLeft)) {
      this.moveLeft();
    } else if (input.isDownAny(EditorInputContext.MoveRight)) {
      this.moveRight();
    }

    for (const holdThrottle of this.holdThrottles) {
      holdThrottle.update(input, deltaTime);
    }

    this.position.add(this.velocity);
  }

  private moveUp = (): void => {
    this.velocity.set(0, -this.size.height);
  };

  private moveDown = (): void => {
    this.velocity.set(0, this.size.height);
  };

  private moveLeft = (): void => {
    this.velocity.set(-this.size.width, 0);
  };

  private moveRight = (): void => {
    this.velocity.set(this.size.width, 0);
  };

  private updateBlinking({ deltaTime }: GameObjectUpdateArgs): void {
    if (this.blinkTimer.isDone()) {
      this.isBlinkVisible = !this.isBlinkVisible;
      this.blinkTimer.reset(BLINK_DELAY);
    } else {
      this.blinkTimer.update(deltaTime);
    }

    this.brush.visible = this.isBlinkVisible;
  }
}
