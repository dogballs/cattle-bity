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

const map = new Map<TankType, TankAttributes>();

map.set(TankType.PlayerPrimaryA, {
  bulletMaxCount: 1,
  bulletSpeed: 10,
  bulletTankDamage: 1,
  bulletWallDamage: 1,
  health: 1,
  moveSpeed: 3,
});

map.set(TankType.PlayerPrimaryB, {
  bulletMaxCount: 1,
  bulletSpeed: 15,
  bulletTankDamage: 1,
  bulletWallDamage: 1,
  health: 1,
  moveSpeed: 3,
});

map.set(TankType.PlayerPrimaryC, {
  bulletMaxCount: 2,
  bulletSpeed: 15,
  bulletTankDamage: 1,
  bulletWallDamage: 1,
  health: 1,
  moveSpeed: 3,
});

map.set(TankType.PlayerPrimaryD, {
  bulletMaxCount: 2,
  bulletSpeed: 15,
  bulletTankDamage: 2,
  bulletWallDamage: 2,
  health: 1,
  moveSpeed: 3,
});

map.set(TankType.EnemyDefaultA, {
  bulletMaxCount: 1,
  bulletSpeed: 10,
  bulletTankDamage: 1,
  bulletWallDamage: 1,
  health: 1,
  moveSpeed: 2,
});

map.set(TankType.EnemyDefaultB, {
  bulletMaxCount: 1,
  bulletSpeed: 10,
  bulletTankDamage: 1,
  bulletWallDamage: 1,
  health: 1,
  moveSpeed: 4,
});

export class TankAttributesFactory {
  public static create(type: TankType): TankAttributes {
    const description = map.get(type);
    if (description === undefined) {
      throw new Error(`Tank attributes not found for type = "${type}"`);
    }

    // TODO: ugly, to prevent changing object by reference
    const attributes = Object.assign({}, description);

    return attributes;
  }
}
