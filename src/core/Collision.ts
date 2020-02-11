import { GameObject } from './GameObject';

export class Collision {
  public source: GameObject;
  public target: GameObject;

  /**
   * Collision holds info about intersection of two objects
   * @param  {GameObject} target - target should react on collision
   * @param  {GameObject} source - collision comes from source
   * @return {Collision}
   */
  constructor(source: GameObject, target: GameObject) {
    this.source = source;
    this.target = target;
  }
}
