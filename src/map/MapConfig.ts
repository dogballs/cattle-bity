import { Rect } from '../core';

export const BRICK_WALL_MULT = 16;
export const STEEL_WALL_MULT = 32;

export enum MapConfigSpawnType {
  EnemyBasic = 'EnemyBasic',
  EnemyFast = 'EnemyFast',
  EnemyPower = 'EnemyPower',
  PlayerPrimary = 'PlayerPrimary',
}

export interface MapConfigSpawnEnemy {
  type: MapConfigSpawnType;
  hasDrop: boolean;
}

export interface MapConfigSpawn {
  enemies: MapConfigSpawnEnemy[];
}

export enum MapConfigWallType {
  Brick = 'Brick',
  Steel = 'Steel',
}

export interface MapConfigWall extends Rect {
  type: MapConfigWallType;
}

// TODO: get rid of this duplication

interface MapDtoSpawnEnemy {
  type: string;
  hasDrop?: boolean;
}

interface MapDtoSpawn {
  enemies?: MapDtoSpawnEnemy[];
}

interface MapDtoWall extends Omit<MapConfigWall, 'type'> {
  type: string;
}

interface MapDto {
  spawn?: MapDtoSpawn;
  walls?: MapDtoWall[];
}

export class MapConfig {
  public spawnEnemies: MapConfigSpawnEnemy[] = [];
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
    const { enemies = [] } = spawn;

    walls.forEach((wall) => {
      this.addWall(wall.type as MapConfigWallType, wall);
    });

    enemies.forEach((enemyConfig) => {
      const { type = MapConfigSpawnType.EnemyBasic } = enemyConfig;
      const hasDrop = !!enemyConfig.hasDrop;

      this.spawnEnemies.push({ type, hasDrop } as MapConfigSpawnEnemy);
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
