import Collision from './Collision.js';

class CollisionDetector {
  static intersectObjects(objects) {
    const collisions = [];

    objects.forEach((source) => {
      objects.forEach((target) => {
        if (source === target) return;

        const sourceBoundingBox = source.getBoundingBox();
        const targetBoundingBox = target.getBoundingBox();

        if (sourceBoundingBox.intersectsBox(targetBoundingBox)) {
          const collision = new Collision(source, target);

          collisions.push(collision);
        }
      });
    });

    return collisions;
  }
}

export default CollisionDetector;
