import { GameObject } from '../core';
import { Field } from '../gameObjects';

export class LevelWorld {
  public sceneRoot: GameObject;
  public field: Field;

  constructor(sceneRoot: GameObject) {
    this.sceneRoot = sceneRoot;

    this.field = new Field();
  }
}
