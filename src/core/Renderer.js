import DisplayObject from './DisplayObject.js';
import Shape from './Shape.js';

class Renderer {
  constructor() {
    this.domElement = document.createElement('canvas');
    this.context = this.domElement.getContext('2d');
  }

  setSize(width, height) {
    this.domElement.width = width;
    this.domElement.height = height;
  }

  getSize() {
    return {
      width: this.domElement.width,
      height: this.domElement.height,
    };
  }

  clear() {
    this.context.clearRect(0, 0, this.domElement.width, this.domElement.height);
  }

  renderDisplayObject(displayObject) {
    const {
      width, height,
      position,
      sprite,
    } = displayObject.render();

    this.context.drawImage(
      sprite.texture.imageElement,
      sprite.bounds.x, sprite.bounds.y,
      sprite.bounds.w, sprite.bounds.h,
      position.x - (width / 2), position.y - (height / 2),
      width, height
    );

    // For debug, draws a frame around rendered object
    this.context.beginPath();
    this.context.moveTo(position.x - (width / 2), position.y - (height / 2));
    this.context.lineTo(position.x + (width / 2), position.y - (height / 2));
    this.context.lineTo(position.x + (width / 2), position.y + (height / 2));
    this.context.lineTo(position.x - (width / 2), position.y + (height / 2));
    this.context.lineTo(position.x - (width / 2), position.y - (height / 2));
    this.context.strokeStyle = '#fff';
    this.context.stroke();
  }

  renderShape(shape) {
    const { fillColor, position, vectors } = shape.render();

    if (vectors.length === 0) {
      return;
    }

    const translatedVectors = vectors
      .map(vector => vector.clone().add(position));

    const [firstVector, ...restVectors] = translatedVectors;

    this.context.beginPath();
    this.context.moveTo(firstVector.x, firstVector.y);

    restVectors.forEach((vector) => {
      this.context.lineTo(vector.x, vector.y);
    });

    this.context.fillStyle = fillColor;
    this.context.fill();
  }

  render(scene) {
    this.clear();

    // When image is scaled, displays pixels as is without smoothing.
    // Should be reset every time after clearing.
    this.context.imageSmoothingEnabled = false;

    const renderObjects = scene.children;

    renderObjects.forEach((renderObject) => {
      // TODO: @mradionov Remove conditional rendering by introducing materials:
      // - SpriteMaterial
      // - ShapeMaterial
      if (renderObject instanceof DisplayObject) {
        this.renderDisplayObject(renderObject);
      } else if (renderObject instanceof Shape) {
        this.renderShape(renderObject);
      }
    });
  }
}

export default Renderer;
