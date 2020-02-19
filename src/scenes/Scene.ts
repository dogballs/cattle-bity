import { GameObject, GameState, KeyboardInput, State } from '../core';

export interface SceneUpdateArgs {
  input?: KeyboardInput;
  gameState?: State<GameState>;
}

export abstract class Scene {
  public readonly root = new GameObject();

  public setup(): void {
    // To be implemented in child
  }

  public abstract update(updateArgs?: SceneUpdateArgs): void;
}
