import { Vector } from '../../core';
import { TankType } from '../../tank';

export interface LevelPlayerSpawnRequestedEvent {
  type: TankType;
  partyIndex: number;
  position: Vector;
}
