import DisplayObject from './DisplayObject';
import Shape from './Shape';

class Scene {
  public children: Array<DisplayObject | Shape>;

  constructor() {
    this.children = [];
  }

  public add(childToAdd) {
    this.children.push(childToAdd);
  }

  public remove(childToRemove) {
    this.children = this.children.filter((child) => child !== childToRemove);
  }

  public hasType(type) {
    return this.children.some((child) => child instanceof type);
  }

  public filterType(type) {
    return this.children.filter((child) => child instanceof type);
  }

  public getChildren() {
    return this.children;
  }
}

export default Scene;
