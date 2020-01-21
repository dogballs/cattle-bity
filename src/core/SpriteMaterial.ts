import { Material } from './Material';
import { Sprite } from './Sprite';

export enum SpriteAlignment {
  Stretch,
  Center,
  TopLeft,
}

export class SpriteMaterial extends Material {
  public alignment: SpriteAlignment = SpriteAlignment.Stretch;

  constructor(sprite: Sprite = null) {
    super();

    this.sprite = sprite;
  }
}
