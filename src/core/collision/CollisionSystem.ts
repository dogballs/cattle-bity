import { Collider } from './Collider';
import { Collision } from './Collision';
import { CollisionContact } from './CollisionContact';

export class CollisionSystem {
  private dynamicColliders: Collider[] = [];
  private staticColliders: Collider[] = [];
  private collisions: Collision[] = [];

  public register(collider: Collider): void {
    if (collider.dynamic) {
      this.dynamicColliders.push(collider);
    } else {
      this.staticColliders.push(collider);
    }

    collider.unregisterRequested.addListenerOnce(() => {
      this.unregister(collider);
    });

    collider.init();
  }

  public unregister(collider: Collider): void {
    const list = collider.dynamic
      ? this.dynamicColliders
      : this.staticColliders;

    const index = list.indexOf(collider);

    if (index !== -1) {
      list.splice(index, 1);
    }
  }

  public update(): void {
    const bothColliders = this.dynamicColliders.concat(this.staticColliders);

    this.collisions = [];

    for (const selfCollider of this.dynamicColliders) {
      let collision = null;

      for (const otherCollider of bothColliders) {
        // Prevent colliding with itself
        if (otherCollider === selfCollider) {
          continue;
        }

        // Prevent children colliding with parents
        if (otherCollider.object.hasParent(selfCollider.object)) {
          continue;
        }

        const selfBox = selfCollider.getBox();
        const otherBox = otherCollider.getBox();

        if (selfBox.intersectsBox(otherBox)) {
          // Lazy create collision if we have at least one intersestion
          if (collision === null) {
            collision = new Collision(selfCollider, selfBox);
          }

          const contact = new CollisionContact(otherCollider, otherBox);
          collision.addContact(contact);
        }
      }

      if (collision !== null) {
        this.collisions.push(collision);
      }
    }
  }

  public collide(): void {
    this.collisions.forEach((collision) => {
      collision.collider.object.invokeCollide(collision);
    });
  }

  public getCollisions(): Collision[] {
    return this.collisions;
  }

  public reset(): void {
    this.dynamicColliders = [];
    this.staticColliders = [];
    this.collisions = [];
  }
}
