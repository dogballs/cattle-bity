import TankMotion from '../models/tank/TankMotion.js';
import EnemyMotion from '../models/enemy-tank/EnemyMotion.js';
import Tank from '../models/tank/Tank.js';
import EnemyTank from '../models/enemy-tank/EnemyTank.js';

let instance;

class MotionManager {
  constructor(renderer, scene) {
    if (!instance) {
      instance = this;
    }
    this.renderer = renderer;
    this.scene = scene;
    this.TankMotion = new TankMotion(this);
    this.EnemyMotion = new EnemyMotion(this);

    return instance;
  }

  moveActor(actor, direction) {
    let motion;
    if (actor instanceof Tank) {
      motion = this.TankMotion;
    } else if (actor instanceof EnemyTank) {
      motion = this.EnemyMotion;
    } else {
      // TODO: default motion logic
    }

    switch (direction) {
      case 'up':
        motion.moveUp(actor);
        break;
      case 'down':
        motion.moveDown(actor);
        break;
      case 'right':
        motion.moveRight(actor);
        break;
      case 'left':
        motion.moveLeft(actor);
        break;
      default:
        break;
    }
  }

  isCollisionExists(actorId, x, y, width, height) {
    // check collisions with all children of scene.
    // For now we check with enemy tanks only but in the future
    // we need to check other objects too
    const children = this.scene.getChildren();
    const filteredChildren = children.filter(child => child.id !== actorId);

    if (filteredChildren.length) {
      // TODO: @aailiyn refactor so the function does not have so much parameters
      // eslint-disable-next-line
      return filteredChildren.some(child => MotionManager.checkCollision(x, y, child.position.x, child.position.y, width, height, child.width, child.height));
    }
    return false;
  }

  static checkCollision(x1, y1, x2, y2, width1, height1, width2, height2) {
    if (Math.abs(x1 - x2) > ((width1 / 2) + (width2 / 2))) {
      return false;
    }
    if (Math.abs(y1 - y2) > ((height1 / 2) + (height2 / 2))) {
      return false;
    }
    return true;
  }
}

export default MotionManager;
