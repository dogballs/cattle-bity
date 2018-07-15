import GameObject from './core/GameObject';
import Vector from './core/Vector';

import Bullet from './gameObjects/Bullet';

class BulletFactory {
  public static makeBullet(tank) {
    const bullet = new Bullet();

    const position = tank.position.clone();
    const { width, height } = tank.dimensions;

    if (tank.rotation === GameObject.Rotation.Up) {
      position.add(new Vector(0, -height / 2));
    } else if (tank.rotation === GameObject.Rotation.Down) {
      position.add(new Vector(0, height / 2));
    } else if (tank.rotation === GameObject.Rotation.Left) {
      position.add(new Vector(-width / 2, 0));
    } else if (tank.rotation === GameObject.Rotation.Right) {
      position.add(new Vector(width / 2, 0));
    }

    bullet.position = position;
    bullet.rotate(tank.rotation);
    bullet.speed = tank.bulletSpeed;
    bullet.damage = tank.bulletDamage;

    return bullet;
  }
}

export default BulletFactory;
