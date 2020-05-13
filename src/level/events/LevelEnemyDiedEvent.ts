import { Vector } from '../../core';
import { TankDeathReason, TankType } from '../../tank';

export interface LevelEnemyDiedEvent {
  type: TankType;
  centerPosition: Vector;
  reason: TankDeathReason;
  hitterPartyIndex: number;
}
