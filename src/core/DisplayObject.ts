import BoundingBox from './BoundingBox';
import Sprite from './Sprite';
import Vector from './Vector';

/**
 * Superclass for all things that can be drawn on screen.
 */
class DisplayObject {
  public height: number;
  public position: Vector;
  public sprite: Sprite;
  public width: number;

  constructor(width, height) {
    this.width = width;
    this.height = height;

    this.position = new Vector(0, 0);

    // Main sprite which will be rendered on the scene
    this.sprite = new Sprite();
  }

  public getBoundingBox() {
    // Top-left point of the object
    const min = new Vector(
      this.position.x - (this.width / 2),
      this.position.y - (this.height / 2),
    );
    // Bottom-right point of the object
    const max = min.clone().add(new Vector(this.width, this.height));

    return new BoundingBox(min, max);
  }

  /**
   * Called on each game loop iteration
   */
  // eslint-disable-next-line class-methods-use-this
  public update(options: object) {
    return undefined;
  }

  // Must-have for each render object
  public render() {
    return {
      height: this.height,
      position: this.position,
      sprite: this.sprite,
      width: this.width,
    };
  }
}

export default DisplayObject;
