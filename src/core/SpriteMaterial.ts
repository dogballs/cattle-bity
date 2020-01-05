import { Material } from './Material';
import { Sprite } from './Sprite';

export class SpriteMaterial extends Material {
  constructor(sprite: Sprite = null) {
    super();

    this.sprite = sprite;
  }
}
