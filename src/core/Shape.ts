import BoundingBox from './BoundingBox';
import Vector from './Vector';

class Shape {
  public fillColor: string;
  public position: Vector;
  public vectors: Vector[];

  constructor() {
    this.fillColor = '#000';
    this.position = new Vector(0, 0);
    this.vectors = [];
  }

  public getBoundingBox() {
    const xs = this.vectors.map((v) => v.x);
    const ys = this.vectors.map((v) => v.y);

    const minX = Math.min(...xs);
    const minY = Math.min(...ys);
    const maxX = Math.max(...xs);
    const maxY = Math.max(...ys);

    const min = new Vector(minX, minY).add(this.position);
    const max = new Vector(maxX, maxY).add(this.position);

    return new BoundingBox(min, max);
  }

  /**
   * Called on each game loop iteration
   */
  // eslint-disable-next-line class-methods-use-this
  public update(options: object): void;

  public render() {
    return {
      fillColor: this.fillColor,
      position: this.position,
      vectors: this.vectors,
    };
  }
}

export default Shape;
