import { TerrainType } from '../terrain';
import { TankTier } from '../tank';

export interface MapConfigSpawnEnemyListItem {
  tier: TankTier;
  drop?: boolean;
}

export interface MapConfigSpawnLocation {
  x: number;
  y: number;
}

export interface MapConfigSpawnEnemy {
  list?: MapConfigSpawnEnemyListItem[];
  locations?: MapConfigSpawnLocation[];
}

export interface MapConfigSpawnPlayer {
  locations?: MapConfigSpawnLocation[];
}

export interface MapConfigSpawn {
  enemy?: MapConfigSpawnEnemy;
  player?: MapConfigSpawnPlayer;
}

export interface MapConfigTerrainRegion {
  type: TerrainType;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface MapConfigTerrain {
  regions?: MapConfigTerrainRegion[];
}

export interface MapConfig {
  spawn?: MapConfigSpawn;
  terrain?: MapConfigTerrain;
}
