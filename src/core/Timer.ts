import { Subject } from './Subject';

export class Timer {
  public done = new Subject();
  public timeLeft = null;

  constructor(timeLeft = null) {
    this.timeLeft = timeLeft;
  }

  public reset(timeLeft): this {
    this.timeLeft = timeLeft;

    return this;
  }

  public stop(): this {
    this.timeLeft = null;

    return this;
  }

  public update(deltaTime: number): void {
    if (!this.isActive()) {
      return;
    }

    this.timeLeft -= deltaTime;

    if (this.timeLeft < 0) {
      this.timeLeft = null;
      this.done.notify(null);
    }
  }

  public isActive(): boolean {
    return this.timeLeft !== null;
  }

  public isDone(): boolean {
    return this.timeLeft === null;
  }
}
