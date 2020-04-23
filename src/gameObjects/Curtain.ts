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
  public zIndex = config.CURTAIN_Z_INDEX;
  private state: State;
  private targetHeight: number;
  private topPart: GameObject;
  private bottomPart: GameObject;

  constructor(width: number, height: number, isOpen = true) {
    super(width, height);

    this.state = isOpen ? State.Open : State.Closed;
  }

  protected setup(): void {
    // Curtain part is half a size of full curtain
    this.targetHeight = this.size.height / 2;

    const initialHeight = this.state === State.Open ? 0 : this.targetHeight;

    this.topPart = new GameObject(this.size.width, initialHeight);
    this.topPart.painter = new RectPainter(config.COLOR_GRAY);

    this.bottomPart = new GameObject(this.size.width, initialHeight);
    this.bottomPart.painter = new RectPainter(config.COLOR_GRAY);
    this.bottomPart.origin.set(0, 1);
    this.bottomPart.position.setY(this.size.height);

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
    this.topPart.updateMatrix();

    this.bottomPart.size.setHeight(nextHeight);
    this.bottomPart.updateMatrix();

    this.dirtyPaintBox();
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
