import { BoundingBox } from '../BoundingBox';

import { Collider } from './Collider';
import { CollisionContact } from './CollisionContact';

export class Collision {
  public collider: Collider;
  public box: BoundingBox;
  public contacts: CollisionContact[] = [];

  constructor(collider: Collider, box: BoundingBox) {
    this.collider = collider;
    this.box = box;
  }

  public addContact(contact: CollisionContact): void {
    this.contacts.push(contact);
  }
}
