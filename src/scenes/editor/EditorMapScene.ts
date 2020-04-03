import { CollisionDetector, Scene } from '../../core';
import { GameObjectUpdateArgs } from '../../game';
import { Border, EditorField, EditorMap } from '../../gameObjects';
import { EditorMapInputContext } from '../../input';
import { MapConfig } from '../../map';
import * as config from '../../config';

import { GameSceneType } from '../GameSceneType';

import { EditorLocationParams } from './params';

export class EditorMapScene extends Scene<EditorLocationParams> {
  private field: EditorField;
  private map: EditorMap;
  private mapConfig: MapConfig;

  protected setup(): void {
    this.root.add(new Border());

    this.mapConfig = this.params.mapConfig;

    this.map = new EditorMap(this.mapConfig);
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
  }

  protected update(updateArgs: GameObjectUpdateArgs): void {
    const { input } = updateArgs;

    if (input.isDownAny(EditorMapInputContext.Menu)) {
      this.navigator.replace(GameSceneType.EditorMenu, this.params);
      return;
    }

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
}
