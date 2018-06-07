class TankMotion {
  constructor(motionManager) {
    this.motionManager = motionManager;
  }

  moveUp(actor) {
    const nextY = actor.position.y - actor.speed;

    // TODO: @aailiyn refactor so the function does not have so much parameters
    // eslint-disable-next-line
    if (this.motionManager.isCollisionExists(actor.id, actor.position.x, nextY, actor.width, actor.height) ||
            (nextY - (actor.height / 2) <= 0)) {
      // return; // TODO: Fix to stop at SceneWall
    }
    actor.position.setY(nextY);
  }

  moveDown(actor) {
    const nextY = actor.position.y + actor.speed;
    const { height } = this.motionManager.renderer.getSize();

    // TODO: @aailiyn refactor so the function does not have so much parameters
    // eslint-disable-next-line
    if (this.motionManager.isCollisionExists(actor.id, actor.position.x, nextY, actor.width, actor.height) ||
            (nextY + (actor.height / 2) >= height)) {
      // return; // TODO: Fix to stop at SceneWall
    }
    actor.position.setY(nextY);
  }

  moveRight(actor) {
    const nextX = actor.position.x + actor.speed;
    const { width } = this.motionManager.renderer.getSize();

    // TODO: @aailiyn refactor so the function does not have so much parameters
    // eslint-disable-next-line
    if (this.motionManager.isCollisionExists(actor.id, nextX, actor.position.y, actor.width, actor.height) ||
            (nextX + (actor.width / 2) >= width)) {
      // return; // TODO: Fix to stop at SceneWall
    }
    actor.position.setX(nextX);
  }

  moveLeft(actor) {
    const nextX = actor.position.x - actor.speed;

    // TODO: @aailiyn refactor so the function does not have so much parameters
    // eslint-disable-next-line
    if (this.motionManager.isCollisionExists(actor.id, nextX, actor.position.y, actor.width, actor.height) ||
            (actor.position.x - actor.speed - (actor.width / 2) <= 0)) {
      // return; // TODO: Fix to stop at SceneWall
    }
    actor.position.setX(nextX);
  }
}

export default TankMotion;
