import RenderableSprite from '../../core/RenderableSprite';
import Sprite from '../../core/Sprite';
import Texture from '../../core/Texture';

class Block extends RenderableSprite {
  constructor(width, height, x, y) {
    super(width, height);

    this.position.x = x;
    this.position.y = y;
    this.texture = new Texture('images/sprite.png');
    this.sprite = new Sprite(this.texture, {
      x: 257, y: 1, w: 13, h: 13,
    });

    // TODO: think about necessary properties for different block types
  }

  update() {}

  render() {
    return {
      height: this.height,
      sprite: this.sprite,
      width: this.width,
    };
  }
}

export default Block;
