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

    // When image is scaled, displays pixels as is without smoothing.
    // Should be reset every time after clearing.
    this.context.imageSmoothingEnabled = false;

    const actors = scene.children;

    actors.forEach((actor) => {
      const { sprite, position } = actor;

      this.context.drawImage(
        sprite.texture.imageElement,
        sprite.bounds.x, sprite.bounds.y,
        sprite.bounds.w, sprite.bounds.h,
        position.x, position.y,
        actor.width, actor.height,
      );
    });
  }
}

export default CanvasRenderer;
