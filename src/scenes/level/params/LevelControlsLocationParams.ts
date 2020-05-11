import { SceneParams } from '../../../core';
import { MapConfig } from '../../../map';

export interface LevelControlsLocationParams extends SceneParams {
  canSelectVariant: boolean;
  mapConfig: MapConfig;
  playerIndex: number;
}
