import Animation from '../core/Animation';
import DisplayObject from '../core/DisplayObject';
import Sprite from '../core/Sprite';
import Texture from '../core/Texture';

class Shield extends DisplayObject {
  private animation: Animation;
  private texture: Texture;

  constructor() {
    super(64, 64);

    this.texture = new Texture('images/sprite.png');

    this.animation = new Animation([
      new Sprite(this.texture, new Sprite.Rect(256, 144, 16, 16)),
      new Sprite(this.texture, new Sprite.Rect(272, 144, 16, 16)),
    ], { delay: 50 });
  }

  public update() {
    this.animation.animate();
  }

  public render() {
    const sprite = this.animation.getCurrentFrame();

    return {
      height: this.height,
      position: this.position,
      sprite,
      width: this.width,
    };
  }
}

export default Shield;
