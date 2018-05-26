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

      // TODO: this logic might not belong here
      let width = actor.width;
      let height = actor.height;
      if (actor.direction === 'right' || actor.direction === 'left') {
        width = actor.height;
        height = actor.width;
      }

      this.context.drawImage(
        sprite.texture.imageElement,
        sprite.bounds.x, sprite.bounds.y,
        sprite.bounds.w, sprite.bounds.h,
        position.x, position.y,
        width, height,
      );

      // For debug, draws a frame around actor
      /*
      this.context.beginPath();
      this.context.moveTo(position.x, position.y);
      this.context.lineTo(position.x + width, position.y);
      this.context.lineTo(position.x + width, position.y + height);
      this.context.lineTo(position.x, position.y + height);
      this.context.lineTo(position.x, position.y);
      this.context.stroke();
      */
    });
  }
}

export default CanvasRenderer;
