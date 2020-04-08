import { GameScript } from '../../game';
import { Base } from '../../gameObjects';
import { PowerupType } from '../../powerup';
import * as config from '../../config';

import { LevelEventBus } from '../LevelEventBus';
import { LevelWorld } from '../LevelWorld';
import { LevelPowerupPickedEvent } from '../events';

export class LevelBaseScript extends GameScript {
  private world: LevelWorld;
  private eventBus: LevelEventBus;
  private base: Base;

  constructor(world: LevelWorld, eventBus: LevelEventBus) {
    super();

    this.world = world;

    this.eventBus = eventBus;
    this.eventBus.powerupPicked.addListener(this.handlePowerupPicked);
  }

  protected setup(): void {
    this.base = new Base();
    this.base.position.set(
      config.BASE_DEFAULT_POSITION.x,
      config.BASE_DEFAULT_POSITION.y,
    );
    this.base.died.addListener(() => {
      this.eventBus.baseDied.notify(null);
      // TODO
    });
    this.world.field.add(this.base);
  }

  private handlePowerupPicked = (event: LevelPowerupPickedEvent): void => {
    const { type: powerupType } = event;

    if (powerupType === PowerupType.BaseDefence) {
      this.base.activateDefence(config.BASE_DEFENCE_POWERUP_DURATION);
    }
  };
}
