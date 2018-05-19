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

    const objects = scene.children;

    objects.forEach((object) => {
      if (object.vectors.length === 0) {
        return;
      }

      const [firstVector, ...restVectors] = object.getPositionedVectors();

      this.context.beginPath();
      this.context.moveTo(firstVector.x, firstVector.y);

      restVectors.forEach((vector) => {
        this.context.lineTo(vector.x, vector.y);
      });

      this.context.fill();
    });
  }
}

export default CanvasRenderer;
