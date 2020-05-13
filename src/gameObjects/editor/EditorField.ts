import { BoxCollider, GameObject } from '../../core';
import { GameUpdateArgs, Rotation, Tag } from '../../game';
import { Base } from '../../gameObjects';
import { TankColor, TankColorFactory, TankType } from '../../tank';
import * as config from '../../config';

import { EditorTankDummy } from './EditorTankDummy';

export class EditorField extends GameObject {
  private base: Base;

  constructor() {
    super(config.FIELD_SIZE, config.FIELD_SIZE);
  }

  protected setup({ collisionSystem }: GameUpdateArgs): void {
    this.base = new Base();
    this.base.collider = new BoxCollider(this.base, false);
    this.base.tags = [Tag.EditorBlockMove];
    this.base.position.set(
      config.BASE_DEFAULT_POSITION.x,
      config.BASE_DEFAULT_POSITION.y,
    );
    collisionSystem.register(this.base.collider);
    this.add(this.base);

    config.PLAYER_DEFAULT_SPAWN_POSITIONS.forEach((location, index) => {
      const dummy = new EditorTankDummy(
        TankType.PlayerA(),
        TankColorFactory.createPlayerColor(index),
      );
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

  protected update(): void {
    this.base.collider.update();
  }
}
