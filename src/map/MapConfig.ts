import { Rect } from '../core';

export const BRICK_WALL_MULT = 16;
export const STEEL_WALL_MULT = 32;

export enum MapConfigSpawnType {
  EnemyAny = 'EnemyAny',
  EnemyBasic = 'EnemyBasic',
  EnemyFast = 'EnemyFast',
  EnemyPower = 'EnemyPower',
  PlayerPrimary = 'PlayerPrimary',
}

export interface MapConfigSpawnDistribution {
  type: MapConfigSpawnType;
  count: number;
}

export interface MapConfigSpawnLocation {
  type: MapConfigSpawnType;
  x: number;
  y: number;
}

export interface MapConfigSpawn {
  distributions: MapConfigSpawnDistribution[];
  locations: MapConfigSpawnLocation[];
}

export enum MapConfigWallType {
  Brick = 'Brick',
  Steel = 'Steel',
}

export interface MapConfigWall extends Rect {
  type: MapConfigWallType;
}

// TODO: get rid of this duplication

interface MapDtoSpawnLocation extends Omit<MapConfigSpawnLocation, 'type'> {
  type: string;
}

interface MapDtoSpawn {
  distributions?: MapConfigSpawnDistribution[];
  locations?: MapDtoSpawnLocation[];
}

interface MapDtoWall extends Omit<MapConfigWall, 'type'> {
  type: string;
}

interface MapDto {
  spawn?: MapDtoSpawn;
  walls?: MapDtoWall[];
}

export class MapConfig {
  public spawnDistributions: MapConfigSpawnDistribution[] = [];
  public spawnLocations: MapConfigSpawnLocation[] = [];
  public walls: MapConfigWall[] = [];

  public addWall(type: MapConfigWallType, rect: Rect): this {
    this.walls.push({
      type,
      ...rect,
    });
    return this;
  }

  // TODO
  public validate(): boolean {
    return true;
  }

  public parse(dto: MapDto): this {
    const { spawn = {}, walls = [] } = dto;
    const { locations = [], distributions = [] } = spawn;

    walls.forEach((wall) => {
      this.addWall(wall.type as MapConfigWallType, wall);
    });

    locations.forEach((spawn) => {
      this.spawnLocations.push(spawn as MapConfigSpawnLocation);
    });

    distributions.forEach((distribution) => {
      this.spawnDistributions.push(distribution as MapConfigSpawnDistribution);
    });

    return this;
  }

  // private assertWall(wall: MapConfigWall, mult: number): void {
  //   const { x, y, w, h, type } = wall;

  //   if (x % mult !== 0 || y % mult !== 0 || w % mult !== 0 || h % mult !== 0) {
  //     throw new Error(
  //       `Invalid rect for "${type}" wall, should be multiple of ${mult}`,
  //     );
  //   }
  // }
}
