import RenderableSprite from './../core/RenderableSprite';

import SpriteFactory, { IMapNameToSprite } from '../sprite/SpriteFactory';

class Bullet extends RenderableSprite {
  private direction: string;
  private speed: number;
  private spriteMap: IMapNameToSprite;

  constructor() {
    super(12, 16);

    this.speed = 15;

    this.direction = 'up';

    this.spriteMap = SpriteFactory.asMap({
      down: 'bullet.down',
      left: 'bullet.left',
      right: 'bullet.right',
      up: 'bullet.up',
    });
  }

  public update() {
    if (this.direction === 'up') {
      this.position.y -= this.speed;
    } else if (this.direction === 'down') {
      this.position.y += this.speed;
    } else if (this.direction === 'right') {
      this.position.x += this.speed;
    } else if (this.direction === 'left') {
      this.position.x -= this.speed;
    }
  }

  public rotate(direction) {
    this.direction = direction;
  }

  public render() {
    let { width, height } = this;

    // Bullet has rectangular shape. If it is rotated, swap width and height
    // for rendering.
    if (this.direction === 'right' || this.direction === 'left') {
      width = this.height;
      height = this.width;
    }

    const sprite = this.spriteMap[this.direction];

    return {
      height,
      sprite,
      width,
    };
  }
}

export default Bullet;
