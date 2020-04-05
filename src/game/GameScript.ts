import { GameUpdateArgs } from './GameUpdateArgs';

export abstract class GameScript {
  private needsSetup = true;
  private enabled = true;

  public disable(): void {
    this.enabled = false;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public invokeUpdate(updateArgs?: GameUpdateArgs): void {
    if (this.enabled === false) {
      return;
    }

    if (this.needsSetup === true) {
      this.needsSetup = false;
      this.setup(updateArgs);
    }

    this.update(updateArgs);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected setup(updateArgs?: GameUpdateArgs): void {
    // Virtual
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected update(updateArgs?: GameUpdateArgs): void {
    // Virtual
  }
}
