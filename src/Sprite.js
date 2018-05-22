import Rect from './Rect.js';
import Texture from './Texture.js';

class Sprite {
  constructor(texture = new Texture(), bounds = new Rect()) {
    this.texture = texture;
    this.bounds = bounds;
  }
}

export default Sprite;
