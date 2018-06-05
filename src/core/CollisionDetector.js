import BoundingBox from './BoundingBox.js';
import Collision from './Collision.js';

class CollisionDetector {
  static intersectObjects(objects) {
    const collisions = [];

    objects.forEach((source) => {
      objects.forEach((target) => {
        if (source === target) return;

        const sourceBoundingBox = new BoundingBox(
          source.position.x - (source.width / 2),
          source.position.y - (source.height / 2),
          source.width,
          source.height
        );

        const targetBoundingBox = new BoundingBox(
          target.position.x - (target.width / 2),
          target.position.y - (target.height / 2),
          target.width,
          target.height
        );

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
