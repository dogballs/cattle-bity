import Node from './Node';
import RenderableShape from './RenderableShape';
import RenderableSprite from './RenderableSprite';

class Renderer {
  public domElement: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  constructor() {
    this.domElement = document.createElement('canvas');
    this.context = this.domElement.getContext('2d');
  }

  public setSize(width: number, height: number) {
    this.domElement.width = width;
    this.domElement.height = height;
  }

  public clear() {
    this.context.clearRect(0, 0, this.domElement.width, this.domElement.height);
  }

  public render(rootNode: Node) {
    this.clear();

    // When image is scaled, display pixels as is without smoothing.
    // Should be reset every time after clearing.
    this.context.imageSmoothingEnabled = false;

    this.renderNode(rootNode);
  }

  private renderNode(node: Node) {
    if (node instanceof RenderableSprite) {
      this.renderSprite(node);
    } else if (node instanceof RenderableShape) {
      this.renderShape(node);
    }

    node.children.forEach((childNode) => {
      this.renderNode(childNode);
    });
  }

  private renderSprite(renderableSprite: RenderableSprite) {
    const { width, height, sprite } = renderableSprite.render();

    const position = renderableSprite.getWorldPosition();

    if (sprite === null) {
      return;
    }

    this.context.drawImage(
      sprite.texture.imageElement,
      sprite.bounds.x, sprite.bounds.y,
      sprite.bounds.w, sprite.bounds.h,
      position.x - (width / 2), position.y - (height / 2),
      width, height,
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

  private renderShape(renderableShape: RenderableShape) {
    const { fillColor, vectors } = renderableShape.render();
    const position = renderableShape.getWorldPosition();

    if (vectors.length === 0) {
      return;
    }

    const translatedVectors = vectors
      .map((vector) => vector.clone().add(position));

    const [firstVector, ...restVectors] = translatedVectors;

    this.context.beginPath();
    this.context.moveTo(firstVector.x, firstVector.y);

    restVectors.forEach((vector) => {
      this.context.lineTo(vector.x, vector.y);
    });

    this.context.fillStyle = fillColor;
    this.context.fill();
  }
}

export default Renderer;
