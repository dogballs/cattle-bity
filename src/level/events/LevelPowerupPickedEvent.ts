import { Vector } from '../../core';
import { PowerupType } from '../../powerups';

export interface LevelPowerupPickedEvent {
  type: PowerupType;
  centerPosition: Vector;
}
