class Collision {
  public target: object;
  public source: object;

  /**
   * Collision holds info about intersection of to objects
   * @param  {DisplayObject/Shape} target - target should react on collision
   * @param  {DisplayObject/Shape} source - collision comes from source
   * @return {Collision}
   */
  constructor(target, source) {
    this.target = target;
    this.source = source;
  }
}

export default Collision;
