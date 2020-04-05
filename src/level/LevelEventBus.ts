import { Subject } from '../core';

import {
  LevelEnemyDiedEvent,
  LevelEnemyExplodedEvent,
  LevelEnemySpawnCompletedEvent,
  LevelEnemySpawnRequestedEvent,
  LevelPlayerDiedEvent,
  LevelPlayerSpawnCompletedEvent,
  LevelPlayerSpawnRequestedEvent,
  LevelPowerupPickedEvent,
  LevelPowerupSpawnedEvent,
} from './events';

export class LevelEventBus {
  public enemyDied = new Subject<LevelEnemyDiedEvent>();
  public enemyExploded = new Subject<LevelEnemyExplodedEvent>();
  public enemySpawnCompleted = new Subject<LevelEnemySpawnCompletedEvent>();
  public enemySpawnRequested = new Subject<LevelEnemySpawnRequestedEvent>();

  public playerDied = new Subject<LevelPlayerDiedEvent>();
  public playerSpawnCompleted = new Subject<LevelPlayerSpawnCompletedEvent>();
  public playerSpawnRequested = new Subject<LevelPlayerSpawnRequestedEvent>();

  public powerupSpawned = new Subject<LevelPowerupSpawnedEvent>();
  public powerupPicked = new Subject<LevelPowerupPickedEvent>();
  public powerupRevoked = new Subject();
}
