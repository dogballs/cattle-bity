import { GameObject, Subject } from '../core';
import { GameObjectUpdateArgs } from '../game';
import * as config from '../config';

import { SceneType } from './SceneType';

export abstract class Scene {
  public root = new GameObject(config.CANVAS_WIDTH, config.CANVAS_HEIGHT);
  public transitioned = new Subject<SceneType>();
  private needsSetup = true;

  public invokeUpdate(args: GameObjectUpdateArgs): void {
    if (this.needsSetup === true) {
      this.needsSetup = false;
      this.setup(args);
    }

    this.update(args);
  }

  protected abstract setup(updateArgs?: GameObjectUpdateArgs): void;
  protected abstract update(updateArgs?: GameObjectUpdateArgs): void;

  protected transition(type: SceneType): void {
    this.transitioned.notify(type);
  }
}
