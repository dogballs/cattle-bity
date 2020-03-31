import { CollisionDetector, Scene } from '../../core';
import { GameObjectUpdateArgs } from '../../game';
import { Border } from '../../gameObjects';
import * as config from '../../config';

import { EditorField, EditorMap } from './objects';

export class EditorMapScene extends Scene {
  private field: EditorField;
  private map: EditorMap;

  protected setup(): void {
    this.root.add(new Border());

    this.map = new EditorMap();
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
