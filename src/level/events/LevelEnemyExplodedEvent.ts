import { Vector } from '../../core';
import { TankDeathReason, TankType } from '../../tank';

export interface LevelEnemyExplodedEvent {
  type: TankType;
  centerPosition: Vector;
  reason: TankDeathReason;
}
