import { GameUpdateArgs, Session } from '../game';
import { MapConfig } from '../map';

import { LevelEventBus } from './LevelEventBus';
import { LevelWorld } from './LevelWorld';

export abstract class LevelScript {
  protected world: LevelWorld;
  protected eventBus: LevelEventBus;
  protected session: Session;
  protected mapConfig: MapConfig;
  protected enabled = true;
  private needsSetup = true;

  public isEnabled(): boolean {
    return this.enabled;
  }

  public enable(): void {
    this.enabled = true;
  }

  public disable(): void {
    this.enabled = false;
  }

  public invokeInit(
    world: LevelWorld,
    eventBus: LevelEventBus,
    session: Session,
    mapConfig: MapConfig,
  ): void {
    this.world = world;
    this.eventBus = eventBus;
    this.session = session;
    this.mapConfig = mapConfig;

    this.init();
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

  protected init(): void {
    // Virtual
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
