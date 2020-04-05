import { Vector } from '../../core';
import { TankType } from '../../tank';

export interface LevelPlayerSpawnCompletedEvent {
  type: TankType;
  centerPosition: Vector;
}
