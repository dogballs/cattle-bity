import { GameObject } from '../GameObject';

import { SceneNavigator } from './SceneNavigator';

export abstract class Scene {
  protected navigator: SceneNavigator;
  protected root: GameObject;
  private needsSetup = true;

  constructor(navigator: SceneNavigator, root: GameObject) {
    this.navigator = navigator;
    this.root = root;
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
