import { GameObject, SpriteMaterial } from './../core';

import { SpriteFactory, MapNameToSprite } from '../sprite/SpriteFactory';

export class Bullet extends GameObject {
  public damage = 0;
  public speed = 15;
  private spriteMap: MapNameToSprite;

  constructor() {
    super(12, 16);

    this.spriteMap = SpriteFactory.asMap({
      [GameObject.Rotation.Up]: 'bullet.up',
      [GameObject.Rotation.Down]: 'bullet.down',
      [GameObject.Rotation.Left]: 'bullet.left',
      [GameObject.Rotation.Right]: 'bullet.right',
    });

    this.material = new SpriteMaterial();
  }

  public update() {
    if (this.rotation === GameObject.Rotation.Up) {
      this.position.y -= this.speed;
    } else if (this.rotation === GameObject.Rotation.Down) {
      this.position.y += this.speed;
    } else if (this.rotation === GameObject.Rotation.Left) {
      this.position.x -= this.speed;
    } else if (this.rotation === GameObject.Rotation.Right) {
      this.position.x += this.speed;
    }

    this.material.sprite = this.spriteMap[this.rotation];
  }
}
