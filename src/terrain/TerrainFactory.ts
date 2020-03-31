import { GameObject, Rect, Size } from '../core';
import {
  BrickTerrainTile,
  IceTerrainTile,
  JungleTerrainTile,
  MenuBrickTerrainTile,
  SteelTerrainTile,
  WaterTerrainTile,
} from '../gameObjects';
import * as config from '../config';

import { TerrainType } from './TerrainType';

export interface TerrainRegionConfig {
  type: TerrainType;
  x: number;
  y: number;
  width: number;
  height: number;
}

export class TerrainFactory {
  public static createFromRegion(
    type: TerrainType,
    regionRect: Rect,
  ): GameObject[] {
    const { x, y, width, height } = regionRect;

    const tiles = [];

    const tileSize = this.getTileSize(type);

    for (let i = x; i < x + width; i += tileSize.width) {
      for (let j = y; j < y + height; j += tileSize.height) {
        const tile = this.createTile(type);
        tile.position.set(i, j);
        tiles.push(tile);
      }
    }

    return tiles;
  }

  public static createFromRegions(
    type: TerrainType,
    regionRects: Rect[],
  ): GameObject[] {
    const allWalls = [];

    regionRects.forEach((regionRect) => {
      const walls = this.createFromRegion(type, regionRect);
      allWalls.push(...walls);
    });

    return allWalls;
  }

  public static createFromRegionConfigs(
    regions: TerrainRegionConfig[],
  ): GameObject[] {
    const tiles = [];

    regions.forEach((region) => {
      const regionRect = new Rect(
        region.x,
        region.y,
        region.width,
        region.height,
      );
      const regionTiles = this.createFromRegion(region.type, regionRect);
      tiles.push(...regionTiles);
    });

    return tiles;
  }

  private static createTile(type: TerrainType): GameObject {
    switch (type) {
      case TerrainType.Brick:
        return new BrickTerrainTile();
      case TerrainType.Steel:
        return new SteelTerrainTile();
      case TerrainType.Jungle:
        return new JungleTerrainTile();
      case TerrainType.Water:
        return new WaterTerrainTile();
      case TerrainType.Ice:
        return new IceTerrainTile();
      case TerrainType.MenuBrick:
        return new MenuBrickTerrainTile();
      default:
        throw new Error(`Tile object for "${type}" not defined`);
    }
  }

  private static getTileSize(type: TerrainType): Size {
    switch (type) {
      case TerrainType.Brick:
        return new Size(config.BRICK_TILE_SIZE, config.BRICK_TILE_SIZE);
      case TerrainType.Steel:
        return new Size(config.STEEL_TILE_SIZE, config.STEEL_TILE_SIZE);
      case TerrainType.Jungle:
        return new Size(config.JUNGLE_TILE_SIZE, config.JUNGLE_TILE_SIZE);
      case TerrainType.Water:
        return new Size(config.WATER_TILE_SIZE, config.WATER_TILE_SIZE);
      case TerrainType.Ice:
        return new Size(config.ICE_TILE_SIZE, config.ICE_TILE_SIZE);
      case TerrainType.MenuBrick:
        return new Size(config.BRICK_TILE_SIZE, config.BRICK_TILE_SIZE);
      default:
        throw new Error(`Tile size for "${type}" not defined`);
    }
  }
}
