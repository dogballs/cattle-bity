import { BoundingBox, GameObject } from '../../core';
import { MapConfig } from '../../map';
import {
  TerrainFactory,
  TerrainRegionConfig,
  TerrainType,
} from '../../terrain';
import * as config from '../../config';

import { EditorBrush } from './EditorBrush';
import { EditorTool } from './EditorTool';

export class EditorMap extends GameObject {
  private container: GameObject;
  private tool: EditorTool;
  private mapConfig: MapConfig;
  private brushes: EditorBrush[];

  constructor(mapConfig: MapConfig) {
    super(config.FIELD_SIZE, config.FIELD_SIZE);

    this.mapConfig = mapConfig;
  }

  protected setup(): void {
    // Holds all map tiles
    this.container = new GameObject();
    this.container.size.copyFrom(this.size);
    this.add(this.container);

    const terrainRegions = this.mapConfig.getTerrainRegions();
    terrainRegions.forEach((region) => {
      const tiles = TerrainFactory.createFromRegionConfigs([region]);

      this.container.add(...tiles);
    });

    // Create brushes. Make sure terrain tile supports defined brush sizes

    const { TILE_SIZE_SMALL, TILE_SIZE_MEDIUM, TILE_SIZE_LARGE } = config;

    this.brushes = [
      new EditorBrush(TILE_SIZE_SMALL, TILE_SIZE_SMALL, TerrainType.Brick),
      new EditorBrush(TILE_SIZE_MEDIUM, TILE_SIZE_MEDIUM, TerrainType.Brick),
      new EditorBrush(TILE_SIZE_LARGE, TILE_SIZE_LARGE, TerrainType.Brick),
      new EditorBrush(TILE_SIZE_MEDIUM, TILE_SIZE_MEDIUM, TerrainType.Steel),
      new EditorBrush(TILE_SIZE_LARGE, TILE_SIZE_LARGE, TerrainType.Steel),
      new EditorBrush(TILE_SIZE_MEDIUM, TILE_SIZE_MEDIUM, TerrainType.Jungle),
      new EditorBrush(TILE_SIZE_LARGE, TILE_SIZE_LARGE, TerrainType.Jungle),
      new EditorBrush(TILE_SIZE_MEDIUM, TILE_SIZE_MEDIUM, TerrainType.Water),
      new EditorBrush(TILE_SIZE_LARGE, TILE_SIZE_LARGE, TerrainType.Water),
      new EditorBrush(TILE_SIZE_MEDIUM, TILE_SIZE_MEDIUM, TerrainType.Ice),
      new EditorBrush(TILE_SIZE_LARGE, TILE_SIZE_LARGE, TerrainType.Ice),
    ];

    this.tool = new EditorTool();
    this.tool.position.set(64, 64);
    this.tool.setBrushes(this.brushes);
    this.tool.draw.addListener(this.handleDraw);
    this.tool.erase.addListener(this.handleErase);
    this.add(this.tool);
  }

  private handleDraw = (): void => {
    // Remove existing tiles first
    this.clearRect(this.tool.getBoundingBox());

    const brush = this.tool.getSelectedBrush();

    const region: TerrainRegionConfig = {
      type: brush.type,
      x: this.tool.position.x,
      y: this.tool.position.y,
      width: this.tool.size.width,
      height: this.tool.size.height,
    };

    this.mapConfig.addTerrainRegion(region);

    const tiles = TerrainFactory.createFromRegionConfigs([region]);

    this.container.add(...tiles);
  };

  private handleErase = (): void => {
    this.clearRect(this.tool.getBoundingBox());
  };

  private clearRect(box: BoundingBox): void {
    const tiles = this.container.children;

    // Iterate in reverse because we are removing items
    for (let i = tiles.length - 1; i >= 0; i -= 1) {
      const tile = tiles[i];
      const tileBox = tile.getBoundingBox();

      if (tileBox.intersectsBox(box)) {
        tile.removeSelf();
      }
    }
  }
}
