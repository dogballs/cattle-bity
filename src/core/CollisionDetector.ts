import { Collision } from './Collision';
import { GameObject } from './GameObject';

export class CollisionDetector {
  public static intersectObjects(
    sourceObjects: GameObject[],
    targetObjects: GameObject[],
  ): Collision[] {
    const collisions = [];

    sourceObjects.forEach((source) => {
      targetObjects.forEach((target) => {
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
