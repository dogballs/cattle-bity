import { Collision } from './Collision';

export class CollisionDetector {
  public static intersectObjects(objects): Collision[] {
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
