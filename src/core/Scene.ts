import BoundingBox from './BoundingBox';
import RenderableNode from './RenderableNode';

class Scene extends RenderableNode {

  public getBoundingBox() {
    return new BoundingBox();
  }

  public update(dependencies: object) {
    return undefined;
  }

  public render() {
    return undefined;
  }

}

export default Scene;
