import { GameObject, Vector } from './core';

import { Bullet } from './gameObjects';

class BulletFactory {
  public static makeBullet(tank): Bullet {
    const bullet = new Bullet();

    const { width: bulletWidth, height: bulletHeight } = bullet.dimensions;

    const position = tank.position.clone();
    const { width: tankWidth, height: tankHeight } = tank.dimensions;

    if (tank.rotation === GameObject.Rotation.Up) {
      position.add(new Vector(tankWidth / 2 - bulletWidth / 2, 0));
    } else if (tank.rotation === GameObject.Rotation.Down) {
      position.add(new Vector(tankWidth / 2 - bulletWidth / 2, tankHeight));
    } else if (tank.rotation === GameObject.Rotation.Left) {
      position.add(new Vector(0, tankHeight / 2 - bulletHeight / 2));
    } else if (tank.rotation === GameObject.Rotation.Right) {
      position.add(new Vector(tankWidth, tankHeight / 2 - bulletHeight / 2));
    }

    bullet.position = position;
    bullet.rotate(tank.rotation);
    bullet.speed = tank.bulletSpeed;
    bullet.damage = tank.bulletDamage;

    return bullet;
  }
}

export default BulletFactory;
