import { GameObject, GameState, KeyboardInput, State } from '../core';

export interface SceneUpdateArgs {
  input?: KeyboardInput;
  gameState?: State<GameState>;
}

export abstract class Scene {
  public readonly root: GameObject;

  constructor(width?: number, height?: number) {
    this.root = new GameObject(width, height);
  }

  public setup(): void {
    // Virtual, to be implemented in child if needed
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public update(updateArgs?: SceneUpdateArgs): void {
    // Virtual, to be implemented in child if needed
  }
}
