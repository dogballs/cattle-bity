import Texture from './Texture.js';

class Sprite {
  constructor(texture = new Texture(), bounds = { x: 0, y: 0, w: 0, h: 0 }) {
    this.texture = texture;
    this.bounds = bounds;
  }
}

export default Sprite;
