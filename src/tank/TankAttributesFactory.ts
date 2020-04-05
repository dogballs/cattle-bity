import { TankType } from './TankType';

export interface TankAttributes {
  bulletMaxCount: number;
  bulletSpeed: number;
  bulletTankDamage: number;
  bulletWallDamage: number;
  health: number;
  moveSpeed: number;
}

// TODO: is it ok? Action class is created when file is loaded and single
// instance is used for all powerups of that type
// TODO: move configuration to separate fil

const map = new Map<string, TankAttributes>();

map.set(TankType.PlayerPrimaryA.serialize(), {
  bulletMaxCount: 1,
  bulletSpeed: 600,
  bulletTankDamage: 1,
  bulletWallDamage: 1,
  health: 1,
  moveSpeed: 180,
});

map.set(TankType.PlayerPrimaryB.serialize(), {
  bulletMaxCount: 1,
  bulletSpeed: 900,
  bulletTankDamage: 1,
  bulletWallDamage: 1,
  health: 1,
  moveSpeed: 180,
});

map.set(TankType.PlayerPrimaryC.serialize(), {
  bulletMaxCount: 2,
  bulletSpeed: 900,
  bulletTankDamage: 1,
  bulletWallDamage: 1,
  health: 1,
  moveSpeed: 180,
});

map.set(TankType.PlayerPrimaryD.serialize(), {
  bulletMaxCount: 2,
  bulletSpeed: 900,
  bulletTankDamage: 2,
  bulletWallDamage: 2,
  health: 1,
  moveSpeed: 180,
});

map.set(TankType.EnemyDefaultA.serialize(), {
  bulletMaxCount: 1,
  bulletSpeed: 600,
  bulletTankDamage: 1,
  bulletWallDamage: 1,
  health: 1,
  moveSpeed: 120,
});

map.set(TankType.EnemyDefaultDropA.serialize(), {
  bulletMaxCount: 1,
  bulletSpeed: 600,
  bulletTankDamage: 1,
  bulletWallDamage: 1,
  health: 1,
  moveSpeed: 120,
});

map.set(TankType.EnemyDefaultB.serialize(), {
  bulletMaxCount: 1,
  bulletSpeed: 600,
  bulletTankDamage: 1,
  bulletWallDamage: 1,
  health: 1,
  moveSpeed: 240,
});

export class TankAttributesFactory {
  public static create(type: TankType): TankAttributes {
    const description = map.get(type.serialize());
    if (description === undefined) {
      throw new Error(`Tank attributes not found for type = "${type}"`);
    }

    // TODO: ugly, to prevent changing object by reference
    const attributes = Object.assign({}, description);

    return attributes;
  }
}
