import Material from './Material';
import Sprite from './Sprite';

class BasicMaterial extends Material {
  constructor(sprite: Sprite = null) {
    super();

    this.sprite = sprite;
  }
}

export default BasicMaterial;
