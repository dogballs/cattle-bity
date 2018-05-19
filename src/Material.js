import Texture from './Texture.js';

class Material {
  constructor(x = 0, y = 0, width = 0, height = 0) {
    this.texture = new Texture();

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}

export default Material;
