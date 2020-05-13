import { SceneParams } from '../../../core';
import { MapConfig } from '../../../map';

export interface LevelPlayLocationParams extends SceneParams {
  mapConfig: MapConfig;
}
