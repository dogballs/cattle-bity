class CanvasRenderer {
  constructor() {
    this.domElement = document.createElement('canvas');
    this.context = this.domElement.getContext('2d');
  }

  setSize(width, height) {
    this.domElement.width = width;
    this.domElement.height = height;
  }

  clear() {
    this.context.clearRect(0, 0, this.domElement.width, this.domElement.height);
  }

  render(scene) {
    this.clear();

    const meshes = scene.children;

    meshes.forEach((mesh) => {
      const { material, position } = mesh;

      this.context.drawImage(
        material.texture.imageElement,
        material.x, material.y,
        material.width, material.height,
        position.x, position.y,
        mesh.width, mesh.height,
      );
    });
  }
}

export default CanvasRenderer;
