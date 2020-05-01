import { Subject } from '../Subject';

import { SceneNavigator, SceneParams } from './SceneNavigator';
import { SceneType } from './SceneType';

interface SceneLocation {
  type: SceneType;
  params: SceneParams;
}

export class SceneRouter<S> implements SceneNavigator {
  public transitionStarted = new Subject();
  private routes = new Map<
    SceneType,
    { new (navigator: SceneNavigator, params: SceneParams): S }
  >();
  private location: SceneLocation;
  private scene: S = null;
  private stack: SceneLocation[] = [];

  public register(
    type: SceneType,
    Scene: { new (navigator: SceneNavigator, params: SceneParams): S },
  ): void {
    this.routes.set(type, Scene);
  }

  public start(type: SceneType, params?: SceneParams): void {
    this.assertRegistered(type);

    this.push(type, params);
  }

  public getCurrentScene(): S {
    return this.scene;
  }

  public push(type: SceneType, params?: SceneParams): void {
    this.assertRegistered(type);

    const location = this.transition(type, params);

    this.stack.push(location);
  }

  public replace(type: SceneType, params?: SceneParams): void {
    this.assertRegistered(type);

    this.stack.pop();

    const location = this.transition(type, params);

    this.stack.push(location);
  }

  public back(): void {
    // Can't back if only one scene left in stack
    if (this.stack.length === 1) {
      return;
    }

    this.stack.pop();

    const lastLocation = this.stack[this.stack.length - 1];

    this.transition(lastLocation.type, lastLocation.params);
  }

  public clearAndPush(type: SceneType, params?: SceneParams): void {
    this.assertRegistered(type);

    this.stack = [];
    this.push(type, params);
  }

  private transition(type: SceneType, params: SceneParams = {}): SceneLocation {
    this.assertRegistered(type);

    this.transitionStarted.notify(null);

    const NextSceneClass = this.routes.get(type);

    const nextScene = new NextSceneClass(this, params);

    this.scene = nextScene;

    const nextLocation: SceneLocation = {
      type,
      params,
    };

    this.location = nextLocation;

    return this.location;
  }

  private assertRegistered(type: SceneType): void {
    if (!this.routes.has(type)) {
      throw new Error(`Scene "${type}" not registered`);
    }
  }
}
