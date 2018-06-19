/**
 * Represents one node in a scene graph.
 * https://en.wikipedia.org/wiki/Scene_graph
 */
class Node {
  public children: this[];
  public parent: this;

  constructor() {
    this.children = [];
    this.parent = null;
  }

  // TODO: figure out input type for a child
  public add(childToAdd) {
    childToAdd.parent = this;

    this.children.push(childToAdd);
  }

  public remove(childToRemove: this) {
    this.children = this.children.filter((child) => child !== childToRemove);
  }

  public traverse(callback: (node: this) => void) {
    callback(this);

    this.children.forEach((child) => {
      child.traverse(callback);
    });
  }

  public traverseAncestors(callback: (node: this) => void) {
    const parent = this.parent;

    if (parent !== null) {
      callback(parent);

      parent.traverseAncestors(callback);
    }
  }

  // TODO: support deep traverse
  public getChildrenOfType(type) {
    return this.children.filter((child) => child instanceof type);
  }

  // TODO: support deep traverse
  public hasChildrenOfType(type): boolean {
    return this.children.some((child) => child instanceof type);
  }
}

export default Node;
