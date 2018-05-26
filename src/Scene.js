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
}

export default Scene;
