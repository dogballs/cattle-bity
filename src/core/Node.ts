import { EventEmitter } from './EventEmitter';

/**
 * Represents one node in a scene graph.
 * https://en.wikipedia.org/wiki/Scene_graph
 */
export class Node extends EventEmitter {
  public children: this[];
  public parent: this;

  constructor() {
    super();

    this.children = [];
    this.parent = null;
  }

  // TODO: figure out input type for a child
  public add(...childrenToAdd): this {
    childrenToAdd.forEach((childToAdd) => {
      childToAdd.parent = this;

      this.children.push(childToAdd);
    });

    return this;
  }

  public replaceSelf(replacement: Node): this {
    if (this.parent === null) {
      return this;
    }

    this.parent.remove(this);
    this.parent.add(replacement);

    return this;
  }

  public remove(childToRemove: this): this {
    this.children = this.children.filter((child) => child !== childToRemove);

    return this;
  }

  public removeSelf(): this {
    if (this.parent === null) {
      return this;
    }

    this.parent.remove(this);

    return this;
  }

  public clear(): this {
    this.children = [];

    return this;
  }

  public traverse(callback: (node: this) => void): this {
    callback(this);

    this.children.forEach((child) => {
      child.traverse(callback);
    });

    return this;
  }

  public traverseAncestors(callback: (node: this) => void): this {
    const parent = this.parent;

    if (parent !== null) {
      callback(parent);

      parent.traverseAncestors(callback);
    }

    return this;
  }

  public flatten(): this[] {
    const nodes = [];

    this.traverse((node) => {
      nodes.push(node);
    });

    return nodes;
  }

  public getChildrenOfType(type): this[] {
    const nodes = [];

    this.traverse((node) => {
      if (node instanceof type) {
        nodes.push(node);
      }
    });

    return nodes;
  }

  public hasChildrenOfType(type): boolean {
    let has = false;

    this.traverse((node) => {
      if (node instanceof type) {
        has = true;
      }
    });

    return has;
  }
}
