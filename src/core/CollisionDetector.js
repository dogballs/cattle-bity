import Collision from './Collision.js';

class CollisionDetector {
  static intersectObjects(objects) {
    const collisions = [];

    objects.forEach((target) => {
      objects.forEach((source) => {
        if (target === source) return;

        const targetBoundingBox = target.getBoundingBox();
        const sourceBoundingBox = source.getBoundingBox();

        if (targetBoundingBox.intersectsBox(sourceBoundingBox)) {
          const collision = new Collision(target, source);

          collisions.push(collision);
        }
      });
    });

    return collisions;
  }
}

export default CollisionDetector;
