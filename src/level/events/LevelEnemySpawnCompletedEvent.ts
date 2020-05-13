import { Vector } from '../../core';
import { TankType } from '../../tank';

export interface LevelEnemySpawnCompletedEvent {
  type: TankType;
  centerPosition: Vector;
  partyIndex: number;
}
