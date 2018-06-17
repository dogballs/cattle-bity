import RenderableShape from '../core/RenderableShape';
import Vector from '../core/Vector';

class SceneWall extends RenderableShape {
  constructor(width = 0, height = 0) {
    super();

    this.vectors = [
      new Vector(0, 0),
      new Vector(width, 0),
      new Vector(width, height),
      new Vector(0, height),
    ];
  }

  update() {}

  render() {
    return {
      fillColor: '#7e7e7e',
      vectors: this.vectors,
    };
  }
}

export default SceneWall;
