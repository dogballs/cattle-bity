import {
  Animation,
  GameObject,
  GameObjectRotation,
  KeyboardKey,
  Sprite,
  SpriteMaterial,
  Vector,
} from '../core';

import { Bullet } from './Bullet';
import { Shield } from './Shield';
import { Tag } from './Tag';
import { SpriteFactory } from '../sprite/SpriteFactory';

export class Tank extends GameObject {
  public bulletDamage: number;
  public bulletSpeed: number;
  public collider = true;
  public material: SpriteMaterial = new SpriteMaterial();
  public tags = [Tag.Tank];
  private animations: Map<GameObjectRotation, Animation<Sprite>> = new Map();
  private speed: number;

  constructor() {
    super(52, 52);

    this.speed = 3;
    this.bulletDamage = 1;
    this.bulletSpeed = 10;

    this.animations.set(
      GameObject.Rotation.Up,
      new Animation(
        SpriteFactory.asList(['tankPlayer.up.1', 'tankPlayer.up.2']),
        { loop: true },
      ),
    );
    this.animations.set(
      GameObject.Rotation.Down,
      new Animation(
        SpriteFactory.asList(['tankPlayer.down.1', 'tankPlayer.down.2']),
        { loop: true },
      ),
    );
    this.animations.set(
      GameObject.Rotation.Left,
      new Animation(
        SpriteFactory.asList(['tankPlayer.left.1', 'tankPlayer.left.2']),
        { loop: true },
      ),
    );
    this.animations.set(
      GameObject.Rotation.Right,
      new Animation(
        SpriteFactory.asList(['tankPlayer.right.1', 'tankPlayer.right.2']),
        { loop: true },
      ),
    );

    const shield = new Shield();
    shield.setCenterFrom(this);
    this.add(shield);
  }

  public update({ input }): void {
    if (input.isHoldLast(KeyboardKey.W)) {
      this.rotate(GameObject.Rotation.Up);
    }
    if (input.isHoldLast(KeyboardKey.S)) {
      this.rotate(GameObject.Rotation.Down);
    }
    if (input.isHoldLast(KeyboardKey.A)) {
      this.rotate(GameObject.Rotation.Left);
    }
    if (input.isHoldLast(KeyboardKey.D)) {
      this.rotate(GameObject.Rotation.Right);
    }

    const moveKeys = [
      KeyboardKey.W,
      KeyboardKey.A,
      KeyboardKey.S,
      KeyboardKey.D,
    ];
    if (input.isHoldAny(moveKeys)) {
      if (this.rotation === GameObject.Rotation.Up) {
        this.position.y -= this.speed;
      } else if (this.rotation === GameObject.Rotation.Down) {
        this.position.y += this.speed;
      } else if (this.rotation === GameObject.Rotation.Right) {
        this.position.x += this.speed;
      } else if (this.rotation === GameObject.Rotation.Left) {
        this.position.x -= this.speed;
      }
    }

    const animation = this.animations.get(this.rotation);
    if (input.isHoldAny(moveKeys)) {
      animation.animate();
    }

    if (input.isDown(KeyboardKey.Space)) {
      this.fire();
    }

    this.material.sprite = animation.getCurrentFrame();
  }

  public collide(target: GameObject): void {
    if (target.tags.includes(Tag.Wall)) {
      const wallBoundingBox = target.getWorldBoundingBox();
      const { width, height } = this.getComputedDimensions();
      const worldPosition = this.getWorldPosition();

      // Fix tank position depending on what wall he hits, so the tank won't be
      // able to pass thru the wall.
      if (this.rotation === GameObject.Rotation.Up) {
        this.setWorldPosition(
          worldPosition.clone().setY(wallBoundingBox.max.y),
        );
      } else if (this.rotation === GameObject.Rotation.Down) {
        this.setWorldPosition(
          worldPosition.clone().setY(wallBoundingBox.min.y - height),
        );
      } else if (this.rotation === GameObject.Rotation.Left) {
        this.setWorldPosition(
          worldPosition.clone().setX(wallBoundingBox.max.x),
        );
      } else if (this.rotation === GameObject.Rotation.Right) {
        this.setWorldPosition(
          worldPosition.clone().setX(wallBoundingBox.min.x - width),
        );
      }
    }
  }

  private fire(): void {
    // TODO: reference to parent is ugly
    if (this.parent.hasChildrenWithTag(Tag.Bullet)) {
      return;
    }

    const bullet = new Bullet();

    const { width: bulletWidth, height: bulletHeight } = bullet.dimensions;

    const position = this.position.clone();
    const { width: tankWidth, height: tankHeight } = this.dimensions;

    if (this.rotation === GameObject.Rotation.Up) {
      position.add(new Vector(tankWidth / 2 - bulletWidth / 2, 0));
    } else if (this.rotation === GameObject.Rotation.Down) {
      position.add(new Vector(tankWidth / 2 - bulletWidth / 2, tankHeight));
    } else if (this.rotation === GameObject.Rotation.Left) {
      position.add(new Vector(0, tankHeight / 2 - bulletHeight / 2));
    } else if (this.rotation === GameObject.Rotation.Right) {
      position.add(new Vector(tankWidth, tankHeight / 2 - bulletHeight / 2));
    }

    bullet.position = position;
    bullet.rotate(this.rotation);
    bullet.speed = this.bulletSpeed;
    bullet.damage = this.bulletDamage;

    this.parent.add(bullet);
  }
}
