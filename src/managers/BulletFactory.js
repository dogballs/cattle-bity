import Bullet from '../models/Bullet';
import Vector from '../core/Vector';

class BulletFactory {
  static makeBullet(tank) {
    const bullet = new Bullet();

    const position = tank.position.clone();

    // When tank is turned to the right/left, the bullet is rotated, which means
    // it's width and height will be swapped. Use width and height as the
    // bullet we be faced up.
    // TODO: improve rotation logic (width and height swap)

    if (tank.direction === 'up') {
      position.add(new Vector(0, -tank.height / 2));
    } else if (tank.direction === 'down') {
      position.add(new Vector(0, tank.height / 2));
    } else if (tank.direction === 'right') {
      position.add(new Vector(tank.width / 2, 0));
    } else if (tank.direction === 'left') {
      position.add(new Vector(-tank.width / 2, 0));
    }

    bullet.position = position;
    bullet.rotate(tank.direction);
    bullet.speed = tank.bulletSpeed;
    bullet.damage = tank.bulletDamage;

    return bullet;
  }
}

export default BulletFactory;
