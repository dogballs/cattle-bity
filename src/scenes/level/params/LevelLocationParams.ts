import { SceneParams } from '../../../core';
import { MapConfig } from '../../../map';

export interface LevelLocationParams extends SceneParams {
  mapConfig: MapConfig;
}
