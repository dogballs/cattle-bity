import { GameObject } from '../GameObject';

import { Collision } from './Collision';

export class CollisionDetector {
  public static intersectObjects(
    selfObjects: GameObject[],
    otherObjects: GameObject[],
  ): Collision[] {
    const collisions = [];

    selfObjects.forEach((self) => {
      otherObjects.forEach((other) => {
        // Prevent object colliding with itself
        if (other === self) {
          return;
        }

        // Prevent children colliding with parents
        if (other.hasParent(self)) {
          return;
        }

        const selfBox = self.getWorldBoundingBox();
        const otherBox = other.getWorldBoundingBox();

        if (selfBox.intersectsBox(otherBox)) {
          const intersectionBox = selfBox.computeIntersectionBox(otherBox);

          const collision = new Collision(self, other, intersectionBox);

          collisions.push(collision);
        }
      });
    });

    return collisions;
  }
}
