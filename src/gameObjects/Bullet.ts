import { GameObject, Sound, Sprite, SpriteRenderer, Subject } from '../core';
import { GameObjectUpdateArgs, Rotation, RotationMap, Tag } from '../game';

import { SmallExplosion } from './SmallExplosion';
import { WallDestroyer } from './WallDestroyer';

export class Bullet extends GameObject {
  public collider = true;
  public tankDamage: number;
  public wallDamage: number;
  public speed: number;
  public tags = [Tag.Bullet];
  public died = new Subject();
  public renderer = new SpriteRenderer();
  private sprites: RotationMap<Sprite> = new RotationMap();
  private hitBrickSound: Sound;
  private hitSteelSound: Sound;

  constructor(speed: number, tankDamage: number, wallDamage: number) {
    super(12, 16);

    this.speed = speed;
    this.tankDamage = tankDamage;
    this.wallDamage = wallDamage;

    this.pivot.set(0.5, 0.5);
  }

  protected setup({ audioLoader, spriteLoader }: GameObjectUpdateArgs): void {
    this.hitBrickSound = audioLoader.load('hit.brick');
    this.hitSteelSound = audioLoader.load('hit.steel');

    this.sprites.set(Rotation.Up, spriteLoader.load('bullet.up'));
    this.sprites.set(Rotation.Down, spriteLoader.load('bullet.down'));
    this.sprites.set(Rotation.Left, spriteLoader.load('bullet.left'));
    this.sprites.set(Rotation.Right, spriteLoader.load('bullet.right'));
  }

  protected update(): void {
    this.translateY(this.speed);

    const rotation = this.getWorldRotation();
    this.renderer.sprite = this.sprites.get(rotation);
  }

  protected collide(target: GameObject): void {
    if (target.tags.includes(Tag.Bullet)) {
      const bullet = target as Bullet;

      // Enemy bullets don't discard each other, they pass thru
      if (bullet.tags.includes(Tag.Enemy) && this.tags.includes(Tag.Enemy)) {
        return;
      }

      // When player bullet hits enemy bullet, they dissappear
      this.nullify();
      bullet.nullify();

      return;
    }

    const isWall = target.tags.includes(Tag.Wall);
    const isBrickWall = isWall && target.tags.includes(Tag.Brick);
    const isBorderWall = isWall && target.tags.includes(Tag.Border);
    const isSteelWall = isWall && target.tags.includes(Tag.Steel);

    if (isWall) {
      this.explode();
    }

    if (isBrickWall || (isSteelWall && this.wallDamage === 2)) {
      const wallWorldBox = target.getWorldBoundingBox();

      const destroyer = new WallDestroyer(this.wallDamage);

      this.add(destroyer);
      destroyer.updateWorldMatrix(true);
      destroyer.setCenter(this.getSelfCenter());

      // At this point destroyer is aligned by the main axis, i.e.
      // if bullet rotation is left/right - destroyer is aligned at "y";
      // if bullet rotation is up/down - destroyer is aligned at "x".
      // What is left is to fix counterpart axis.

      destroyer.updateWorldMatrix();
      const destroyerWorldBox = destroyer.getWorldBoundingBox();

      const rotation = destroyer.getWorldRotation();
      // TODO: rework after collisions, because now we are tied to axis
      if (rotation === Rotation.Up) {
        destroyer.translateY(destroyerWorldBox.max.y - wallWorldBox.max.y);
      } else if (rotation === Rotation.Down) {
        destroyer.translateY(wallWorldBox.min.y - destroyerWorldBox.min.y);
      } else if (rotation === Rotation.Left) {
        destroyer.translateY(destroyerWorldBox.max.x - wallWorldBox.max.x);
      } else if (rotation === Rotation.Right) {
        destroyer.translateY(wallWorldBox.min.x - destroyerWorldBox.min.x);
      }

      this.parent.attach(destroyer);

      // TODO: it collides with multiple "bricks", multiple audio sources are
      // triggered
      // Only player bullets make sound
      if (this.tags.includes(Tag.Player)) {
        this.hitBrickSound.play();
      }
    } else if (isSteelWall || isBorderWall) {
      // TODO: when tank is grade 4, it can destroy steel walls, and in that
      // case they make the same sound as brick walls
      // Only player bullets make sound
      if (this.tags.includes(Tag.Player)) {
        this.hitSteelSound.play();
      }
    }
  }

  public nullify(): void {
    this.removeSelf();
    this.died.notify();
  }

  public explode(): void {
    const explosion = new SmallExplosion();
    explosion.setCenter(this.getCenter());
    this.replaceSelf(explosion);
    this.died.notify();
  }
}
