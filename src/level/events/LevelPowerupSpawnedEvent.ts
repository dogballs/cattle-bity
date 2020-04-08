import { Vector } from '../../core';
import { PowerupType } from '../../powerup';

export interface LevelPowerupSpawnedEvent {
  type: PowerupType;
  position: Vector;
}
