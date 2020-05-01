import { GameObject, Scene, SceneParams } from '../core';
import { GameUpdateArgs } from '../game';
import * as config from '../config';

export abstract class GameScene<T extends SceneParams = {}> extends Scene {
  protected root: GameObject;
  protected params: T;
  private needsSetup = true;

  public getRoot(): GameObject {
    return this.root;
  }

  public invokeUpdate(updateArgs: GameUpdateArgs): void {
    if (this.needsSetup === true) {
      this.needsSetup = false;
      this.root = this.createRoot();
      this.root.invokeUpdate(updateArgs);
      this.setup(updateArgs);
    }

    this.update(updateArgs);
  }

  protected abstract setup(updateArgs: GameUpdateArgs): void;

  // Calls update on all children of the scene root
  protected update(updateArgs: GameUpdateArgs): void {
    this.root.traverseDescedants((child) => {
      child.invokeUpdate(updateArgs);
    });
  }

  protected createRoot(): GameObject {
    const root = new GameObject();
    root.size.set(config.CANVAS_WIDTH, config.CANVAS_HEIGHT);
    root.updateMatrix();
    return root;
  }
}
