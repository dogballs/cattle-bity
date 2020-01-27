import { EventEmitter, GameObject } from './core';
import {
  Spawn,
  PlayerTank,
  BasicEnemyTank,
  FastEnemyTank,
  PowerEnemyTank,
} from './gameObjects';
import { MapConfig, MapConfigSpawn, MapConfigSpawnType } from './map/MapConfig';

export class Spawner extends EventEmitter {
  private readonly mapConfig: MapConfig;
  private readonly field: GameObject;
  private readonly objects: Map<MapConfigSpawn, GameObject> = new Map();

  constructor(mapConfig: MapConfig, field: GameObject) {
    super();

    this.mapConfig = mapConfig;
    this.field = field;
  }

  public init(): void {
    this.mapConfig.spawns.forEach((spawnConfig) => {
      const spawn = new Spawn();
      spawn.position.set(spawnConfig.x, spawnConfig.y);
      spawn.on('completed', () => {
        const tank = this.createTank(spawnConfig.type);
        tank.setCenterFrom(spawn);
        spawn.replaceSelf(tank);
      });
      this.field.add(spawn);
    });
  }

  private createTank(type: MapConfigSpawnType): GameObject {
    switch (type) {
      case MapConfigSpawnType.EnemyBasic:
        return new BasicEnemyTank();
      case MapConfigSpawnType.EnemyFast:
        return new FastEnemyTank();
      case MapConfigSpawnType.EnemyPower:
        return new PowerEnemyTank();
      case MapConfigSpawnType.Player:
      default:
        return new PlayerTank();
    }
  }
}
