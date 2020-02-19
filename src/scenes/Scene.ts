import { GameObject, GameState, KeyboardInput, State } from '../core';

export interface SceneUpdateArgs {
  input?: KeyboardInput;
  gameState?: State<GameState>;
}

export class Scene {
  public readonly root;

  constructor(width?: number, height?: number) {
    this.root = new GameObject(width, height);
  }

  public setup(): void {
    // To be implemented in child
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public update(updateArgs?: SceneUpdateArgs): void {
    // To be implemented in child
  }
}
