import { BoundingBox, GameObject } from '../../../core';
import { MapConfig } from '../../../map';
import {
  TerrainFactory,
  TerrainRegionConfig,
  TerrainType,
} from '../../../terrain';
import * as config from '../../../config';

import { EditorBrush } from './EditorBrush';
import { EditorTool } from './EditorTool';

export class EditorMap extends GameObject {
  private container: GameObject;
  private tool: EditorTool;
  private mapConfig: MapConfig = {
    terrain: {
      regions: [],
    },
  };
  private brushes: EditorBrush[];

  constructor() {
    super(config.FIELD_SIZE, config.FIELD_SIZE);
  }

  protected setup(): void {
    // Holds all map tiles
    this.container = new GameObject();
    this.container.size.copyFrom(this.size);
    this.add(this.container);

    this.brushes = [
      new EditorBrush(16, 16, TerrainType.Brick),
      new EditorBrush(32, 32, TerrainType.Brick),
      new EditorBrush(64, 64, TerrainType.Brick),
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

    this.mapConfig.terrain.regions.push(region);

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
