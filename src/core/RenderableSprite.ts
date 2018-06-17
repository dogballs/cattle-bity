import BoundingBox from './BoundingBox';
import RenderableNode from './RenderableNode';
import Sprite from './Sprite';
import Vector from './Vector';

interface IRenderableSpriteRenderResult {
  height: number;
  sprite: Sprite;
  width: number;
}

abstract class RenderableSprite extends RenderableNode {
  public height: number;
  public sprite: Sprite;
  public width: number;

  constructor(width: number = 0, height: number = 0) {
    super();

    this.width = width;
    this.height = height;

    this.sprite = new Sprite();
  }

  public getBoundingBox(): BoundingBox {
    // Top-left point of the object
    const min = new Vector(
      this.position.x - (this.width / 2),
      this.position.y - (this.height / 2),
    );
    // Bottom-right point of the object
    const max = min.clone().add(new Vector(this.width, this.height));

    return new BoundingBox(min, max);
  }

  public abstract render(): IRenderableSpriteRenderResult;
}

export default RenderableSprite;
