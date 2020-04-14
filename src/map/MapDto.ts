import { TerrainType } from '../terrain';
import { TankTier } from '../tank';

export interface MapDtoSpawnEnemyListItem {
  tier: TankTier;
  drop?: boolean;
}

export interface MapDtoSpawnLocation {
  x: number;
  y: number;
}

export interface MapDtoSpawnEnemy {
  list?: MapDtoSpawnEnemyListItem[];
  locations?: MapDtoSpawnLocation[];
}

export interface MapDtoSpawnPlayer {
  locations?: MapDtoSpawnLocation[];
}

export interface MapDtoSpawn {
  enemy?: MapDtoSpawnEnemy;
  player?: MapDtoSpawnPlayer;
}

export interface MapDtoTerrainRegion {
  type: TerrainType;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface MapDtoTerrain {
  regions?: MapDtoTerrainRegion[];
}

export interface MapDto {
  version?: number;
  spawn?: MapDtoSpawn;
  terrain?: MapDtoTerrain;
}
