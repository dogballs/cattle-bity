import { Vector } from '../../core';
import { PowerupType } from '../../powerup';

export interface LevelPowerupPickedEvent {
  type: PowerupType;
  centerPosition: Vector;
  playerIndex: number;
}
