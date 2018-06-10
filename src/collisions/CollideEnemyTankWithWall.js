class CollideEnemyTankWithWall {
  constructor(collision, scene) {
    this.collision = collision;

    // TODO: @mradionov Decouple scene from collisions.
    this.scene = scene;
  }

  collide() {
    const tank = this.collision.target;
    const wall = this.collision.source;

    const wallBoundingBox = wall.getBoundingBox();

    // Fix tank position depending on what wall he hits, so the tank won't be
    // able to pass thru the wall.
    if (tank.direction === 'up') {
      tank.position.y = wallBoundingBox.max.y + (tank.height / 2);
      tank.rotate('down');
    } else if (tank.direction === 'down') {
      tank.position.y = wallBoundingBox.min.y - (tank.height / 2);
      tank.rotate('up');
    } else if (tank.direction === 'right') {
      tank.position.x = wallBoundingBox.min.x - (tank.width / 2);
    } else if (tank.direction === 'left') {
      tank.position.x = wallBoundingBox.max.x + (tank.width / 2);
    }
  }
}

export default CollideEnemyTankWithWall;
