class CollideBlock {
  constructor(collision, scene) {
    this.collision = collision;

    // TODO: @mradionov Decouple scene from collisions.
    this.scene = scene;
  }

  collide() {
    const block = this.collision.source;

    this.scene.remove(block);
  }
}

export default CollideBlock;
