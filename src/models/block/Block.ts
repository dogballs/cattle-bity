import RenderableSprite from '../../core/RenderableSprite';
import Sprite from '../../core/Sprite';
import Texture from '../../core/Texture';

import SpriteFactory from '../../sprite/SpriteFactory';

class Block extends RenderableSprite {
  constructor(width, height, x, y) {
    super(width, height);

    this.position.set(x, y);

    this.sprite = SpriteFactory.asOne('block');

    // TODO: think about necessary properties for different block types
  }

  public update() {
    return undefined;
  }

  public render() {
    return {
      height: this.height,
      sprite: this.sprite,
      width: this.width,
    };
  }
}

export default Block;
