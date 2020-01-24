import { GameObject } from '../core';
import { Bullet } from './Bullet';
import { Tag } from './Tag';
import { TankExplosion } from './TankExplosion';

export abstract class EnemyTank extends GameObject {
  public health = 1;
  public tags = [Tag.Tank, Tag.Enemy];

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
        // this.rotate(GameObject.Rotation.Down);
      } else if (this.rotation === GameObject.Rotation.Down) {
        this.setWorldPosition(
          worldPosition.clone().setY(wallBoundingBox.min.y - height),
        );
        // this.rotate(GameObject.Rotation.Up);
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

    if (target.tags.includes(Tag.Bullet)) {
      const bullet = target as Bullet;
      const nextHealth = this.health - bullet.damage;
      if (nextHealth > 0) {
        this.health = nextHealth;
      } else {
        const tankExplosion = new TankExplosion();
        tankExplosion.setCenterFrom(this);
        tankExplosion.onComplete = (): void => {
          tankExplosion.removeSelf();
        };
        this.replaceSelf(tankExplosion);
      }
    }
  }
}
