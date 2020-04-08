import { Subject } from '../core';

import {
  LevelEnemyDiedEvent,
  LevelEnemyExplodedEvent,
  LevelEnemyHitEvent,
  LevelEnemySpawnCompletedEvent,
  LevelEnemySpawnRequestedEvent,
  LevelMapTileDestroyedEvent,
  LevelPlayerDiedEvent,
  LevelPlayerSpawnCompletedEvent,
  LevelPlayerSpawnRequestedEvent,
  LevelPowerupPickedEvent,
  LevelPowerupSpawnedEvent,
} from './events';

export class LevelEventBus {
  public baseDied = new Subject();

  public enemyDied = new Subject<LevelEnemyDiedEvent>();
  public enemyExploded = new Subject<LevelEnemyExplodedEvent>();
  public enemyHit = new Subject<LevelEnemyHitEvent>();
  public enemySpawnCompleted = new Subject<LevelEnemySpawnCompletedEvent>();
  public enemySpawnRequested = new Subject<LevelEnemySpawnRequestedEvent>();

  public mapTileDestroyed = new Subject<LevelMapTileDestroyedEvent>();

  public paused = new Subject();
  public unpaused = new Subject();

  public playerDied = new Subject<LevelPlayerDiedEvent>();
  public playerFired = new Subject();
  public playerSpawnCompleted = new Subject<LevelPlayerSpawnCompletedEvent>();
  public playerSpawnRequested = new Subject<LevelPlayerSpawnRequestedEvent>();

  public powerupSpawned = new Subject<LevelPowerupSpawnedEvent>();
  public powerupPicked = new Subject<LevelPowerupPickedEvent>();
  public powerupRevoked = new Subject();
}
