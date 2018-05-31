class Scene {
  constructor() {
    this.children = [];
  }

  add(childToAdd) {
    this.children.push(childToAdd);
  }

  remove(childToRemove) {
    this.children = this.children.filter(child => child !== childToRemove);
  }

  getChildren() {
    return this.children;
  }
}

export default Scene;
