import { Size, Vector } from '../../core';
import { TerrainType } from '../../terrain';

export interface LevelMapTileDestroyedEvent {
  type: TerrainType;
  position: Vector;
  size: Size;
}
