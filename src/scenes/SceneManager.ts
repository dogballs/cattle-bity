import { Scene } from './Scene';
import { SceneType } from './SceneType';

type SceneConstructor = { new (): Scene };

export class SceneManager {
  private registered = new Map<SceneType, SceneConstructor>();
  private type: SceneType;
  private scene: Scene;

  constructor(initialType: SceneType) {
    this.type = initialType;
  }

  public register(type: SceneType, Scene: SceneConstructor): void {
    this.registered.set(type, Scene);
  }

  public start(): void {
    this.transition(this.type);
  }

  public getScene(): Scene {
    return this.scene;
  }

  private transition(nextType: SceneType): void {
    if (!this.registered.has(nextType)) {
      throw new Error(`Scene not registered`);
    }

    const SceneClass = this.registered.get(nextType);
    const scene = new SceneClass();
    scene.transitioned.addListenerOnce(this.handleTransition);

    this.scene = scene;
    this.type = nextType;
  }

  private handleTransition = (nextType: SceneType): void => {
    this.transition(nextType);
  };
}
