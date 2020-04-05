import { Vector } from '../../core';
import { PowerupType } from '../../powerups';

export interface LevelPowerupSpawnedEvent {
  type: PowerupType;
  position: Vector;
}
