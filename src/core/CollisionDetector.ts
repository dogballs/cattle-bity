import { Collision } from './Collision';
import { GameObject } from './GameObject';

export class CollisionDetector {
  public static intersectObjects(objects) {
    const collisions = [];

    objects.forEach((target) => {
      objects.forEach((source) => {
        if (target === source) {
          return;
        }

        const targetBoundingBox = target.getWorldBoundingBox();
        const sourceBoundingBox = source.getWorldBoundingBox();

        if (targetBoundingBox.intersectsBox(sourceBoundingBox)) {
          const collision = new Collision(target, source);

          collisions.push(collision);
        }
      });
    });

    return collisions;
  }
}
