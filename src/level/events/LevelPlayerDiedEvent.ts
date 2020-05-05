import { Vector } from '../../core';
import { TankType } from '../../tank';

export interface LevelPlayerDiedEvent {
  type: TankType;
  centerPosition: Vector;
  playerIndex: number;
}
