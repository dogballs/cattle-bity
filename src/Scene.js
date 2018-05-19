class Scene {
  constructor() {
    this.children = [];
  }

  add(child) {
    this.children.push(child);
  }
}

export default Scene;
