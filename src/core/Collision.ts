import RenderableNode from './RenderableNode';

class Collision {
  public target: RenderableNode;
  public source: RenderableNode;

  /**
   * Collision holds info about intersection of two objects
   * @param  {RenderableNode} target - target should react on collision
   * @param  {RenderableNode} source - collision comes from source
   * @return {Collision}
   */
  constructor(target: RenderableNode, source: RenderableNode) {
    this.target = target;
    this.source = source;
  }
}

export default Collision;
