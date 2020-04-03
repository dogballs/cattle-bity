import { GameObject } from '../GameObject';

import { SceneNavigator, SceneParams } from './SceneNavigator';

export abstract class Scene<T extends SceneParams = {}> {
  protected navigator: SceneNavigator;
  protected root: GameObject;
  protected params: T;
  private needsSetup = true;

  constructor(navigator: SceneNavigator, root: GameObject, params: T) {
    this.navigator = navigator;
    this.root = root;
    this.params = params;
  }

  public getRoot(): GameObject {
    return this.root;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public invokeUpdate(...args: any[]): void {
    if (this.needsSetup === true) {
      this.needsSetup = false;
      this.setup(...args);
    }

    this.update(...args);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected abstract setup(...args: any[]): void;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected abstract update(...args: any[]): void;
}
