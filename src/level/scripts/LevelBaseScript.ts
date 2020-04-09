import { Base } from '../../gameObjects';
import { PowerupType } from '../../powerup';
import * as config from '../../config';

import { LevelScript } from '../LevelScript';
import { LevelPowerupPickedEvent } from '../events';

export class LevelBaseScript extends LevelScript {
  private base: Base;

  protected setup(): void {
    this.eventBus.powerupPicked.addListener(this.handlePowerupPicked);

    this.base = new Base();
    this.base.position.set(
      config.BASE_DEFAULT_POSITION.x,
      config.BASE_DEFAULT_POSITION.y,
    );
    this.base.died.addListener(() => {
      this.eventBus.baseDied.notify(null);
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
