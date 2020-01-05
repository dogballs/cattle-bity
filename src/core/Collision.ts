import { GameObject } from './GameObject';

export class Collision {
  public target: GameObject;
  public source: GameObject;

  /**
   * Collision holds info about intersection of two objects
   * @param  {GameObject} target - target should react on collision
   * @param  {GameObject} source - collision comes from source
   * @return {Collision}
   */
  constructor(target: GameObject, source: GameObject) {
    this.target = target;
    this.source = source;
  }
}
