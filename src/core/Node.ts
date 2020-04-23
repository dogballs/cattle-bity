export class Node {
  public children: this[] = [];
  public parent: this = null;
  public removedChildren: this[] = [];
  public isRemoved = false;

  // TODO: figure out input type for a child
  public add(...childrenToAdd): this {
    for (const childToAdd of childrenToAdd) {
      if (childToAdd.parent !== null) {
        childToAdd.parent.remove(childToAdd, false);
      }

      childToAdd.parent = this;
      this.children.push(childToAdd);
    }

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

  public remove(childToRemove, addToRemoved = true): boolean {
    const index = this.children.indexOf(childToRemove);

    if (index === -1) {
      return false;
    }

    if (addToRemoved) {
      childToRemove.isRemoved = true;

      this.removedChildren.push(childToRemove);
    }

    this.children.splice(index, 1);

    return true;
  }

  public removeSelf(): this {
    if (this.parent === null) {
      return this;
    }

    this.parent.remove(this);

    return this;
  }

  public removeAllChildren(): this {
    this.children = [];

    return this;
  }

  public cleanupRemoved(): void {
    this.removedChildren = [];
  }

  public traverse(callback: (node: this) => void): this {
    callback(this);

    for (const child of this.children) {
      child.traverse(callback);
    }

    return this;
  }

  public traverseDescedants(callback: (node: this) => void): this {
    for (const child of this.children) {
      child.traverse(callback);
    }

    return this;
  }

  public hasParent(parentToFind: this): boolean {
    let parent = this.parent;

    while (parent !== null) {
      if (parent === parentToFind) {
        return true;
      }

      parent = parent.parent;
    }

    return false;
  }

  public traverseParents(callback: (node: this) => void): this {
    const parent = this.parent;

    if (parent !== null) {
      callback(parent);

      parent.traverseParents(callback);
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
}
