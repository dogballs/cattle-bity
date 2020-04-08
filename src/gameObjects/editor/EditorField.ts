import { Collider, GameObject } from '../../core';
import { Rotation, Tag } from '../../game';
import { Base } from '../../gameObjects';
import { TankColor, TankType } from '../../tank';
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
    base.position.set(
      config.BASE_DEFAULT_POSITION.x,
      config.BASE_DEFAULT_POSITION.y,
    );
    this.add(base);

    config.PLAYER_DEFAULT_SPAWN_POSITIONS.forEach((location) => {
      const dummy = new EditorTankDummy(TankType.PlayerA(), TankColor.Primary);
      dummy.position.set(location.x, location.y);
      this.add(dummy);
    });

    config.ENEMY_DEFAULT_SPAWN_POSITIONS.forEach((location) => {
      const dummy = new EditorTankDummy(
        TankType.EnemyA(),
        TankColor.Default,
        Rotation.Down,
      );
      dummy.position.set(location.x, location.y);
      this.add(dummy);
    });
  }
}
