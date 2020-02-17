import { Subject } from './Subject';

export class Timer {
  public ticks = -1;
  public done = new Subject();

  constructor(ticks = -1) {
    this.ticks = ticks;
  }

  public reset(ticks): this {
    this.ticks = ticks;

    return this;
  }

  public stop(): this {
    this.ticks = -1;

    return this;
  }

  public tick(): this {
    if (!this.isActive()) {
      return;
    }

    this.ticks = this.ticks - 1;

    if (this.ticks === -1) {
      this.done.notify();
    }

    return this;
  }

  public isActive(): boolean {
    return this.ticks > -1;
  }

  public isDone(): boolean {
    return this.ticks === -1;
  }
}
