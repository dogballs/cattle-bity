import { GameObject } from '../GameObject';

import { Scene } from './Scene';
import { SceneNavigator } from './SceneNavigator';
import { SceneType } from './SceneType';

type SceneConstructor = {
  new (navigator: SceneNavigator, root: GameObject): Scene;
};

export class SceneRouter implements SceneNavigator {
  private routes = new Map<SceneType, SceneConstructor>();
  private type: SceneType;
  private scene: Scene;
  private stack: SceneType[] = [];

  public register(type: SceneType, Scene: SceneConstructor): void {
    this.routes.set(type, Scene);
  }

  public start(type: SceneType): void {
    this.assertRegistered(type);

    this.push(type);
  }

  public getCurrentScene(): Scene {
    return this.scene;
  }

  public push(type: SceneType): void {
    this.assertRegistered(type);

    this.stack.push(type);
    this.transition(type);
  }

  public replace(type: SceneType): void {
    this.assertRegistered(type);

    this.stack.pop();
    this.stack.push(type);

    this.transition(type);
  }

  public back(): void {
    // Can't back if only one scene left in stack
    if (this.stack.length === 1) {
      return;
    }

    this.stack.pop();

    const lastType = this.stack[this.stack.length - 1];
    this.transition(lastType);
  }

  public clearAndPush(type: SceneType): void {
    this.assertRegistered(type);

    this.stack = [];
    this.push(type);
  }

  protected createRoot(): GameObject {
    return new GameObject();
  }

  private transition(type: SceneType): void {
    this.assertRegistered(type);

    const SceneClass = this.routes.get(type);

    const root = this.createRoot();

    const scene = new SceneClass(this, root);

    this.scene = scene;
    this.type = type;
  }

  private assertRegistered(type: SceneType): void {
    if (!this.routes.has(type)) {
      throw new Error(`Scene "${type}" not registered`);
    }
  }
}
