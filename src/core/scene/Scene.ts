import { SceneNavigator, SceneParams } from './SceneNavigator';

export abstract class Scene<T extends SceneParams = {}> {
  protected navigator: SceneNavigator;
  protected params: T;

  constructor(navigator: SceneNavigator, params: T) {
    this.navigator = navigator;
    this.params = params;
  }
}
