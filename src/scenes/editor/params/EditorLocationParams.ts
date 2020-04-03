import { SceneParams } from '../../../core';
import { MapConfig } from '../../../map';

import { EditorLoadState } from './EditorLoadState';

export interface EditorLocationParams extends SceneParams {
  mapConfig: MapConfig;
  loadState: EditorLoadState;
}
