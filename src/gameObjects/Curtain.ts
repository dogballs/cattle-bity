import { GameObject, RectRenderer } from '../core';
import * as config from '../config';

enum State {
  Closed,
  Closing,
  Open,
  Opening,
}

const HEIGHT_INCREMENT = 25;

export class Curtain extends GameObject {
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
    this.topPart.renderer = new RectRenderer(config.COLOR_GRAY);

    this.bottomPart = new GameObject(width, initialHeight);
    this.bottomPart.renderer = new RectRenderer(config.COLOR_GRAY);
    this.bottomPart.pivot.set(0, 1);
    this.bottomPart.position.setY(height);
  }

  protected setup(): void {
    this.add(this.topPart);
    this.add(this.bottomPart);
  }

  protected update(): void {
    if (this.state === State.Open || this.state === State.Closed) {
      return;
    }

    let nextHeight = this.topPart.size.height;
    if (this.state === State.Closing) {
      nextHeight += HEIGHT_INCREMENT;

      if (nextHeight >= this.targetHeight) {
        nextHeight = this.targetHeight;
        this.state = State.Closed;
      }
    } else if (this.state === State.Opening) {
      nextHeight -= HEIGHT_INCREMENT;

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
