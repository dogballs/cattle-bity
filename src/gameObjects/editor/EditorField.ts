import { Collider, GameObject } from '../../core';
import { Rotation, Tag } from '../../game';
import { Base } from '../../gameObjects';
import { TankType } from '../../tank';
import * as config from '../../config';

import { EditorTankDummy } from './EditorTankDummy';

export class EditorField extends GameObject {
  constructor() {
    super(config.FIELD_SIZE, config.FIELD_SIZE);
  }

  protected setup(): void {
    const base = new Base();
    base.collider = new Collider(false);
    base.tags = [Tag.EditorBlockMove];
    base.position.set(352, 736);
    this.add(base);

    config.PLAYER_DEFAULT_SPAWN_POSITIONS.forEach((location) => {
      const dummy = new EditorTankDummy(TankType.PlayerPrimaryA);
      dummy.position.set(location.x, location.y);
      this.add(dummy);
    });

    config.ENEMY_DEFAULT_SPAWN_POSITIONS.forEach((location) => {
      const dummy = new EditorTankDummy(TankType.EnemyDefaultA, Rotation.Down);
      dummy.position.set(location.x, location.y);
      this.add(dummy);
    });
  }
}
