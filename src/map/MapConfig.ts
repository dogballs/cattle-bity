import { Rect } from '../core';

export const BRICK_WALL_MULT = 16;
export const STEEL_WALL_MULT = 32;

export enum MapConfigSpawnType {
  Player = 'Player',
  EnemyBasic = 'EnemyBasic',
  EnemyFast = 'EnemyFast',
  EnemyPower = 'EnemyPower',
}

export interface MapConfigSpawn {
  type: MapConfigSpawnType;
  x: number;
  y: number;
}

export enum MapConfigWallType {
  Brick = 'Brick',
  Steel = 'Steel',
}

export interface MapConfigWall extends Rect {
  type: MapConfigWallType;
}

interface MapJSONSpawn extends Omit<MapConfigSpawn, 'type'> {
  type: string;
}

interface MapJSONWall extends Omit<MapConfigWall, 'type'> {
  type: string;
}

interface MapJSON {
  spawns?: MapJSONSpawn[];
  walls?: MapJSONWall[];
}

export class MapConfig {
  public spawns: MapConfigSpawn[] = [];
  public walls: MapConfigWall[] = [];

  public addWall(type: MapConfigWallType, rect: Rect): this {
    this.walls.push({
      type,
      ...rect,
    });
    return this;
  }

  public validate(): boolean {
    return true;
  }

  public toJSON(): MapJSON {
    const json: MapJSON = {
      walls: this.walls,
    };
    return json;
  }

  public static fromJSON(json: MapJSON): MapConfig {
    const { spawns = [], walls = [] } = json;

    const config = new MapConfig();

    walls.forEach((wall) => {
      config.addWall(wall.type as MapConfigWallType, wall);
    });

    spawns.forEach((spawn) => {
      config.spawns.push(spawn as MapConfigSpawn);
    });

    return config;
  }

  private assertWall(wall: MapConfigWall, mult: number): void {
    const { x, y, w, h, type } = wall;

    if (x % mult !== 0 || y % mult !== 0 || w % mult !== 0 || h % mult !== 0) {
      throw new Error(
        `Invalid rect for "${type}" wall, should be multiple of ${mult}`,
      );
    }
  }
}
