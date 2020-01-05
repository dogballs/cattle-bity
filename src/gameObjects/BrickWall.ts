import { GameObject, Sprite, SpriteMaterial } from '../core';

import { SpriteFactory } from '../sprite/SpriteFactory';

export class BrickWall extends GameObject {
  private sprites: Sprite[];

  constructor() {
    super(16, 16);

    this.sprites = SpriteFactory.asList([
      'wall.brick.1',
      'wall.brick.2',
      'wall.brick.3',
      'wall.brick.4',
      'wall.brick.5',
      'wall.brick.6',
      'wall.brick.7',
      'wall.brick.8',
    ]);

    this.material = new SpriteMaterial();
    this.material.sprite = this.getSpriteByPosition();
  }

  public update() {
    this.material.sprite = this.getSpriteByPosition();
  }

  private getSpriteByPosition() {
    const horizontalIndex = (this.position.x % 64) / 16;
    const verticalIndex = (this.position.y % 32) / 16;
    const index = horizontalIndex + verticalIndex * 4;

    const sprite = this.sprites[index];

    return sprite;
  }
}
