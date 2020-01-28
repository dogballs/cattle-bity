import { EventEmitter, GameObject } from './core';
import {
  Spawn,
  PlayerTank,
  BasicEnemyTank,
  FastEnemyTank,
  PowerEnemyTank,
} from './gameObjects';
import {
  MapConfig,
  MapConfigSpawnLocation,
  MapConfigSpawnType,
} from './map/MapConfig';
import { ArrayUtils } from './utils';

export class Spawner extends EventEmitter {
  private readonly mapConfig: MapConfig;
  private readonly field: GameObject;
  private readonly history: Map<MapConfigSpawnType, number> = new Map();

  constructor(mapConfig: MapConfig, field: GameObject) {
    super();

    this.mapConfig = mapConfig;
    this.field = field;
  }

  public init(): void {
    this.mapConfig.spawnLocations.forEach((spawnLocation) => {
      this.spawn(spawnLocation);
    });
  }

  private spawn(spawnLocation: MapConfigSpawnLocation): void {
    const spawn = new Spawn();
    spawn.position.set(spawnLocation.x, spawnLocation.y);
    spawn.on('completed', () => {
      const tank = this.createTank(spawnLocation.type);
      tank.setCenterFrom(spawn);
      tank.on('died', () => {
        this.spawn(spawnLocation);
      });
      spawn.replaceSelf(tank);
    });
    this.field.add(spawn);

    const count = this.history.get(spawnLocation.type) || 0;
    this.history.set(spawnLocation.type, count + 1);
  }

  private createTank(type: MapConfigSpawnType): GameObject {
    switch (type) {
      case MapConfigSpawnType.EnemyAny:
        return this.createTank(this.getAnyEnemyType());
      case MapConfigSpawnType.EnemyBasic:
        return new BasicEnemyTank();
      case MapConfigSpawnType.EnemyFast:
        return new FastEnemyTank();
      case MapConfigSpawnType.EnemyPower:
        return new PowerEnemyTank();
      case MapConfigSpawnType.PlayerPrimary:
      default:
        return new PlayerTank();
    }
  }

  private getAnyEnemyType(): MapConfigSpawnType {
    const validTypes = [
      MapConfigSpawnType.EnemyBasic,
      MapConfigSpawnType.EnemyFast,
      MapConfigSpawnType.EnemyPower,
    ];
    const availableTypes = new Set<MapConfigSpawnType>();

    this.mapConfig.spawnDistributions.forEach((distribution) => {
      if (!validTypes.includes(distribution.type)) {
        return;
      }
      const spawnedCount = this.history.get(distribution.type) || 0;
      if (spawnedCount >= distribution.count) {
        return;
      }
      availableTypes.add(distribution.type);
    });

    const type = ArrayUtils.random(Array.from(availableTypes));

    return type;
  }

  // private canSpawn(type: MapConfigSpawnType): boolean {
  //   // Temporary, must look at lives
  //   if (type === MapConfigSpawnType.PlayerPrimary) {
  //     return true;
  //   }

  //   const distribution = this.mapConfig.spawnDistributions.find(
  //     (distribution) => {
  //       return distribution.type === type;
  //     },
  //   );
  //   if (distribution === undefined) {
  //     return false;
  //   }

  //   const spawnedCount = this.history.get(type) || 0;
  //   const;
  // }
}
