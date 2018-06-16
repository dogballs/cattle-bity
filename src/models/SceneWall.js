import Shape from '../core/Shape';
import Vector from '../core/Vector';

class SceneWall extends Shape {
  constructor(width = 0, height = 0) {
    super();

    this.vectors = [
      new Vector(0, 0),
      new Vector(width, 0),
      new Vector(width, height),
      new Vector(0, height),
    ];
  }

  render() {
    return {
      fillColor: '#7e7e7e',
      position: this.position,
      vectors: this.vectors,
    };
  }
}

export default SceneWall;
