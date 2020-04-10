import { GameObject, RectPainter } from '../core';
import { GameUpdateArgs } from '../game';
import * as config from '../config';

enum State {
  Closed,
  Closing,
  Open,
  Opening,
}

const SLIDE_SPEED = 1500;

export class Curtain extends GameObject {
  public zIndex = 8;
  private state: State;
  private readonly targetHeight: number;
  private readonly topPart: GameObject;
  private readonly bottomPart: GameObject;

  constructor(width: number, height: number, isOpen = true) {
    super(width, height);

    // Curtain part is half a size of full curtain
    this.targetHeight = height / 2;
    this.state = isOpen ? State.Open : State.Closed;

    const initialHeight = isOpen ? 0 : this.targetHeight;

    this.topPart = new GameObject(width, initialHeight);
    this.topPart.painter = new RectPainter(config.COLOR_GRAY);

    this.bottomPart = new GameObject(width, initialHeight);
    this.bottomPart.painter = new RectPainter(config.COLOR_GRAY);
    this.bottomPart.origin.set(0, 1);
    this.bottomPart.position.setY(height);
  }

  protected setup(): void {
    this.add(this.topPart);
    this.add(this.bottomPart);
  }

  protected update(updateArgs: GameUpdateArgs): void {
    const { deltaTime } = updateArgs;

    if (this.state === State.Open || this.state === State.Closed) {
      return;
    }

    let nextHeight = this.topPart.size.height;
    if (this.state === State.Closing) {
      nextHeight += SLIDE_SPEED * deltaTime;

      if (nextHeight >= this.targetHeight) {
        nextHeight = this.targetHeight;
        this.state = State.Closed;
      }
    } else if (this.state === State.Opening) {
      nextHeight -= SLIDE_SPEED * deltaTime;

      if (nextHeight <= 0) {
        nextHeight = 0;
        this.state = State.Open;
      }
    }

    this.topPart.size.setHeight(nextHeight);
    this.bottomPart.size.setHeight(nextHeight);
  }

  public close(): void {
    if (this.state !== State.Open) {
      return;
    }
    this.state = State.Closing;
  }

  public open(): void {
    if (this.state !== State.Closed) {
      return;
    }
    this.state = State.Opening;
  }
}
