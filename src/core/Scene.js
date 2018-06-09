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

  hasType(type) {
    return this.children.some(child => child instanceof type);
  }

  filterType(type) {
    return this.children.filter(child => child instanceof type);
  }

  getChildren() {
    return this.children;
  }
}

export default Scene;
