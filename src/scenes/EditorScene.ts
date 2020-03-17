import { GameObject } from '../core';
import { GameObjectUpdateArgs } from '../game';
import {
  Base,
  Border,
  EditorBrush,
  EditorBrushType,
  Field,
} from '../gameObjects';
import { MapConfig } from '../map';
import { TerrainFactory, TerrainType } from '../terrain';
import * as config from '../config';

import { Scene } from './Scene';

export class EditorScene extends Scene {
  private base: Base;
  private field: Field;
  private map: GameObject;
  private brush: EditorBrush;
  private mapConfig: MapConfig = {
    terrain: {
      regions: [],
    },
  };

  protected setup(): void {
    this.root.add(new Border());

    this.map = new GameObject(config.FIELD_SIZE, config.FIELD_SIZE);
    this.map.position.set(
      config.BORDER_LEFT_WIDTH,
      config.BORDER_TOP_BOTTOM_HEIGHT,
    );
    this.root.add(this.map);

    this.field = new Field();
    this.field.position.set(
      config.BORDER_LEFT_WIDTH,
      config.BORDER_TOP_BOTTOM_HEIGHT,
    );
    this.root.add(this.field);

    this.base = new Base();
    this.base.position.set(352, 736);
    this.field.add(this.base);

    this.brush = new EditorBrush();
    this.brush.draw.addListener(this.handleBrushDraw);
    this.field.add(this.brush);
  }

  protected update(updateArgs: GameObjectUpdateArgs): void {
    this.root.traverseDescedants((child) => {
      child.invokeUpdate(updateArgs);
    });
  }

  private handleBrushDraw = (event): void => {
    const rect = event.box.toRect();

    // TODO: check if coordinates are already taken?

    if (event.brushType === EditorBrushType.BrickWall) {
      this.mapConfig.terrain.regions.push({
        type: TerrainType.Brick,
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
      });

      this.renderMap();
    }
  };

  private renderMap(): void {
    const tiles = TerrainFactory.createFromRegionConfigs(
      this.mapConfig.terrain.regions,
    );

    this.map.removeAllChildren();
    this.map.add(...tiles);
  }
}
