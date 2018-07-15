import GameObject from './../core/GameObject';
import SpriteMaterial from './../core/SpriteMaterial';

import SpriteFactory, { IMapNameToSprite } from '../sprite/SpriteFactory';

class Bullet extends GameObject {
  public damage: number = 0;
  public speed: number = 15;
  private spriteMap: IMapNameToSprite;

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

export default Bullet;
