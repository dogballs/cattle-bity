import BoundingBox from './BoundingBox';
import Node from './Node';
import Vector from './Vector';

abstract class RenderableNode extends Node {
  public position: Vector;

  constructor() {
    super();

    this.position = new Vector();
  }

  public getWorldPosition(): Vector {
    const worldPosition = this.position.clone();

    this.traverseAncestors((parent) => {
      worldPosition.add(parent.position);
    });

    return worldPosition;
  }

  public abstract getBoundingBox(): BoundingBox;

  // TODO: remove "input" as a dependency
  /**
   * Will be called on each game loop iteration
   * @param {object} dependencies
   */
  public abstract update(dependencies: object);

  /**
   * Called by renderer
   */
  public abstract render();
}

export default RenderableNode;
