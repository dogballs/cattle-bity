import { TerrainType } from './TerrainType';

export interface TerrainRegionConfig {
  type: TerrainType;
  x: number;
  y: number;
  width: number;
  height: number;
}
