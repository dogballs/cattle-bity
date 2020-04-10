import { Rect, Vector } from '../core';
import { TankParty, TankType } from '../tank';
import { TerrainRegionConfig } from '../terrain';
import * as config from '../config';

import { MapDto } from './MapDto';
import { MapDtoSchema } from './MapDtoSchema';

export interface MapConfigToJsonOptions {
  pretty?: boolean;
}

const DEFAULT_TO_JSON_OPTIONS = {
  pretty: true,
};

export class MapConfig {
  private dto: MapDto;

  constructor() {
    this.dto = this.fillAndValidate({});
  }

  public getDto(): MapDto {
    return this.dto;
  }

  public fromDto(dto: MapDto): void {
    this.dto = this.fillAndValidate(dto);
  }

  public fillAndValidate(dto: MapDto): MapDto {
    const { value: validatedDto, error } = MapDtoSchema.validate(dto);

    if (error !== undefined) {
      throw error;
    }

    return validatedDto;
  }

  public addTerrainRegion(region: TerrainRegionConfig): void {
    this.dto.terrain.regions.push(region);
  }

  public clearTerrainRect(rectToClear: Rect): void {
    const { regions } = this.dto.terrain;

    // Iterate in reverse because we are removing items from array
    for (let i = regions.length - 1; i >= 0; i -= 1) {
      const region = regions[i];

      const regionRect = new Rect(
        region.x,
        region.y,
        region.width,
        region.height,
      );

      if (regionRect.intersectsRect(rectToClear)) {
        regions.splice(i, 1);
      }
    }
  }

  public getTerrainRegions(): TerrainRegionConfig[] {
    return this.dto.terrain.regions;
  }

  public getPlayerSpawnPosition(playerIndex: number): Vector {
    const dtoLocations = this.dto.spawn.player.locations;

    let location = config.PLAYER_DEFAULT_SPAWN_POSITIONS[playerIndex];

    // Allow overriding spawn location in map config
    if (dtoLocations[playerIndex] !== undefined) {
      location = dtoLocations[playerIndex];
    }

    const position = new Vector(location.x, location.y);

    return position;
  }

  public getEnemySpawnPositions(): Vector[] {
    const dtoLocations = this.dto.spawn.enemy.locations;

    let locations = config.ENEMY_DEFAULT_SPAWN_POSITIONS;

    // Allow overriding spawn location in map config
    if (dtoLocations.length > 0) {
      locations = dtoLocations;
    }

    const positions = locations.map((location) => {
      return new Vector(location.x, location.y);
    });

    return positions;
  }

  public getEnemySpawnList(): TankType[] {
    const types = this.dto.spawn.enemy.list.map((item) => {
      return new TankType(TankParty.Enemy, item.tier, item.drop);
    });
    return types;
  }

  public isEnemySpawnListEmpty(): boolean {
    return this.dto.spawn.enemy.list.length === 0;
  }

  public fillEnemySpawnList(type: TankType): void {
    for (let i = 0; i < config.ENEMY_MAX_TOTAL_COUNT; i += 1) {
      this.dto.spawn.enemy.list[i] = {
        tier: type.tier,
        drop: type.hasDrop,
      };
    }
  }

  public setEnemySpawnListItem(index: number, type: TankType): void {
    this.dto.spawn.enemy.list[index] = {
      tier: type.tier,
      drop: type.hasDrop,
    };
  }

  public toJSON(argOptions: MapConfigToJsonOptions = {}): string {
    const options = Object.assign({}, DEFAULT_TO_JSON_OPTIONS, argOptions);

    let json;
    if (options.pretty) {
      json = JSON.stringify(this.dto, null, 2);
    } else {
      json = JSON.stringify(this.dto);
    }

    return json;
  }

  public fromJSON(json: string): void {
    const dto = JSON.parse(json);

    this.dto = this.fillAndValidate(dto);
  }
}
