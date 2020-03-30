import { CollisionDetector, GameObject, Scene } from '../../core';
import { GameObjectUpdateArgs } from '../../game';
import { Border } from '../../gameObjects';
import { MapConfig } from '../../map';
import {
  TerrainFactory,
  TerrainRegionConfig,
  TerrainType,
} from '../../terrain';
import * as config from '../../config';

import { EditorBrush, EditorField, EditorTool } from './objects';

interface BrushVariant {
  type: TerrainType;
  height: number;
  width: number;
}

const BRUSH_VARIANTS: BrushVariant[] = [
  { type: TerrainType.Brick, width: 16, height: 16 },
  { type: TerrainType.Brick, width: 32, height: 32 },
  { type: TerrainType.Brick, width: 64, height: 64 },
];

export class EditorMapScene extends Scene {
  private field: EditorField;
  private map: GameObject;
  private tool: EditorTool;
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

    this.field = new EditorField();
    this.field.position.set(
      config.BORDER_LEFT_WIDTH,
      config.BORDER_TOP_BOTTOM_HEIGHT,
    );
    this.root.add(this.field);

    const brushes = BRUSH_VARIANTS.map((variant) => {
      const brush = new EditorBrush(
        variant.width,
        variant.height,
        variant.type,
      );
      return brush;
    });

    // brushes.push(brickSmallBrush);

    this.tool = new EditorTool();
    this.tool.position.set(64, 64);
    this.tool.setBrush(brushes[0]);
    this.tool.draw.addListener(this.handleBrushDraw);
    this.field.add(this.tool);
  }

  protected update(updateArgs: GameObjectUpdateArgs): void {
    this.root.traverseDescedants((child) => {
      child.invokeUpdate(updateArgs);
    });

    // Update all transforms before checking collisions
    this.root.updateWorldMatrix(false, true);

    const nodes = this.root.flatten();

    const activeNodes = [];
    const bothNodes = [];

    nodes.forEach((node) => {
      if (node.collider === null) {
        return;
      }

      if (node.collider.active) {
        activeNodes.push(node);
        bothNodes.push(node);
      } else {
        bothNodes.push(node);
      }
    });

    // Detect and handle collisions of all objects on the scene
    const collisions = CollisionDetector.intersectObjects(
      activeNodes,
      bothNodes,
    );
    collisions.forEach((collision) => {
      collision.self.invokeCollide(collision);
    });
  }

  private handleBrushDraw = (): void => {
    const brush = this.tool.getBrush();

    const region: TerrainRegionConfig = {
      type: brush.type,
      x: this.tool.position.x,
      y: this.tool.position.y,
      width: this.tool.size.width,
      height: this.tool.size.height,
    };

    this.mapConfig.terrain.regions.push(region);

    const tiles = TerrainFactory.createFromRegionConfigs(
      this.mapConfig.terrain.regions,
    );
    this.map.add(...tiles);
  };
}
