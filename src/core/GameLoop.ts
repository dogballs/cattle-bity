import { Subject } from './Subject';

// References:
// https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame

// requestAnimationFrame is usually 60 fps; in seconds
const IDEAL_DELTA_TIME = 1 / 60;

// Delta limit value in seconds. Limit might be reached if game loop is paused
// or breakpoint is activated during debugging.
const DELTA_TIME_LIMIT = 1;

export interface GameLoopTickEvent {
  deltaTime: number;
}

export class GameLoop {
  public readonly tick = new Subject<GameLoopTickEvent>();
  private lastTimestamp = null;
  private requestedStop = false;

  public start(): void {
    this.loop();
  }

  // WARNING: a couple of already queued callbacks might still fire after stop
  public stop(): void {
    this.requestedStop = true;
  }

  // For manual stepping over frames when loop is paused
  public next(ticks = 1): void {
    for (let i = 0; i < ticks; i += 1) {
      this.tick.notify({ deltaTime: IDEAL_DELTA_TIME });
    }
  }

  private loop = (timestamp = null): void => {
    if (this.requestedStop === true) {
      this.requestedStop = false;
      return;
    }

    // For the very first run loop() is called from the code and timestamp is
    // not known. On the second call loop() is called by requestAnimationFrame,
    // which also provides a timestamp.
    // Use ideal fixed delta value for the first run.
    let deltaTime = IDEAL_DELTA_TIME;
    if (timestamp !== null) {
      // Timestamp is originally in milliseconds, convert to seconds
      deltaTime = (timestamp - this.lastTimestamp) / 1000;

      // If delta is too large, we must have resumed from stop() or breakpoint.
      // Use ideal default delta only for this frame.
      if (deltaTime > DELTA_TIME_LIMIT) {
        deltaTime = IDEAL_DELTA_TIME;
      }
    }

    this.lastTimestamp = timestamp;

    this.tick.notify({ deltaTime });

    window.requestAnimationFrame(this.loop);
  };
}
